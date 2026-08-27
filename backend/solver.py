# backend/solver.py

from ortools.sat.python import cp_model

def solve_itinerary(days, budget, hotel_candidates, attraction_candidates, restaurant_candidates, transit_estimate, group_size, midway_hotel=None):
    """
    Solves for the optimal itinerary using Google OR-Tools CP-SAT.
    """
    model = cp_model.CpModel()

    num_nights = max(1, days - 1)
    rooms_needed = max(1, (group_size + 1) // 2)

    # 1. Decision Variables
    x_a = {}
    for i, a in enumerate(attraction_candidates):
        for d in range(days):
            x_a[(i, d)] = model.NewBoolVar(f'attraction_{i}_day_{d}')

    start_time = {}
    for i, a in enumerate(attraction_candidates):
        start_time[i] = model.NewIntVar(360, 1200, f'start_time_{i}')

    hotel_selected = {}
    for h, hotel in enumerate(hotel_candidates):
        hotel_selected[h] = model.NewBoolVar(f'hotel_{h}')

    # 2. Hard Constraints
    if hotel_candidates:
        model.Add(sum(hotel_selected.values()) == 1)

    for i in range(len(attraction_candidates)):
        model.Add(sum(x_a[(i, d)] for d in range(days)) <= 1)

    for d in range(days):
        # On road transit days, reduce sightseeing slots to give time for driving
        max_sights = 1 if (d == 0 or (d == 1 and midway_hotel)) else 3
        model.Add(sum(x_a[(i, d)] for i in range(len(attraction_candidates))) <= max_sights)

    # Opening hours constraints
    for i, a in enumerate(attraction_candidates):
        open_min = int(a.get("opening_hour", 9) * 60)
        close_min = int(a.get("closing_hour", 18) * 60)
        dur_min = int(a.get("duration_hrs", 2) * 60)

        model.Add(start_time[i] >= open_min)
        model.Add(start_time[i] + dur_min <= close_min)

    # Overlap protection
    travel_buffer = 30
    for d in range(days):
        for i in range(len(attraction_candidates)):
            for j in range(i + 1, len(attraction_candidates)):
                dur_i = int(attraction_candidates[i].get("duration_hrs", 2) * 60)
                dur_j = int(attraction_candidates[j].get("duration_hrs", 2) * 60)

                both_visited = model.NewBoolVar(f'both_{i}_{j}_day_{d}')
                model.AddBoolAnd([x_a[(i, d)], x_a[(j, d)]]).OnlyEnforceIf(both_visited)

                i_before_j = model.NewBoolVar(f'i_before_j_{d}_{i}_{j}')
                model.Add(start_time[i] + dur_i + travel_buffer <= start_time[j]).OnlyEnforceIf(i_before_j)
                model.Add(start_time[j] + dur_j + travel_buffer <= start_time[i]).OnlyEnforceIf(i_before_j.Not())
                
                model.Add(i_before_j == 1).OnlyEnforceIf(both_visited)

    # 3. Cost Calculations
    if midway_hotel:
        dest_nights = max(0, num_nights - 1)
        dest_hotel_cost_sum = sum(
            int(hotel["cost_inr"]) * dest_nights * rooms_needed * hotel_selected[h]
            for h, hotel in enumerate(hotel_candidates)
        )
        midway_cost_sum = int(midway_hotel["cost_inr"]) * 1 * rooms_needed
        hotel_cost_sum = dest_hotel_cost_sum + midway_cost_sum
    else:
        hotel_cost_sum = sum(
            int(hotel["cost_inr"]) * num_nights * rooms_needed * hotel_selected[h]
            for h, hotel in enumerate(hotel_candidates)
        )

    attraction_cost_sum = sum(
        int(a["cost_inr"]) * sum(x_a[(i, d)] for d in range(days)) * group_size
        for i, a in enumerate(attraction_candidates)
    )

    food_cost = int(600 * group_size * days)
    transit_cost = int(transit_estimate["cost_inr"]) + int(1000 * days)

    total_cost = model.NewIntVar(0, int(budget) * 100, 'total_cost')
    model.Add(total_cost == (hotel_cost_sum + attraction_cost_sum + food_cost + transit_cost))
    model.Add(total_cost <= int(budget))

    # 4. Objective
    score_terms = []
    for i, a in enumerate(attraction_candidates):
        score_weight = int(a["ml_score"] * 1000)
        score_terms.append(score_weight * sum(x_a[(i, d)] for d in range(days)))

    for h, hotel in enumerate(hotel_candidates):
        score_weight = int(hotel["ml_score"] * 1000)
        score_terms.append(score_weight * hotel_selected[h])

    model.Maximize(sum(score_terms))

    # 5. Solve CP-SAT
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 4.0
    status = solver.Solve(model)

    itinerary = {
        "status": "Infeasible",
        "total_cost_inr": 0.0,
        "selected_hotel": None,
        "days": [],
        "cost_breakdown": {}
    }

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        itinerary["status"] = "Optimal"
        itinerary["total_cost_inr"] = float(solver.Value(total_cost))

        selected_hotel_obj = None
        for h, hotel in enumerate(hotel_candidates):
            if solver.BooleanValue(hotel_selected[h]):
                selected_hotel_obj = hotel
                itinerary["selected_hotel"] = hotel
                break

        itinerary["cost_breakdown"] = {
            "stays": float(solver.Value(hotel_cost_sum)),
            "transport": transit_cost,
            "food": food_cost,
            "activities": float(solver.Value(attraction_cost_sum)),
            "allocated_budget": budget,
            "remaining_balance": budget - float(solver.Value(total_cost))
        }

        is_road_trip = transit_estimate.get("duration_hrs", 0) > 0

        # Daily Schedules
        for d in range(days):
            day_schedule = []

            # Day 1: Highway Travel stops + lunch
            if d == 0:
                if is_road_trip:
                    day_schedule.append({
                        "name": "Start Road Trip Driving",
                        "category": "logistics",
                        "start_time": "08:00",
                        "end_time": "11:30",
                        "cost_inr": 0.0,
                        "description": "Depart from starting city origin and begin driving on the highway."
                    })
                    day_schedule.append({
                        "name": "Highway Tea & Rest Stop Plaza",
                        "category": "logistics",
                        "start_time": "11:30",
                        "end_time": "12:00",
                        "cost_inr": 100.0,
                        "description": "Short break to rest, stretch, and get tea/snacks."
                    })
                    day_schedule.append({
                        "name": "Roadside Dhaba Highway Lunch",
                        "category": "food",
                        "start_time": "13:30",
                        "end_time": "14:30",
                        "cost_inr": 300.0,
                        "description": "Stop for fresh local regional lunch on the highway."
                    })
                    hotel_name = midway_hotel["name"] if midway_hotel else (selected_hotel_obj["name"] if selected_hotel_obj else "Destination Hotel")
                    day_schedule.append({
                        "name": f"Arrive & Check-in at {hotel_name}",
                        "category": "logistics",
                        "start_time": "17:30",
                        "end_time": "18:30",
                        "cost_inr": 0.0,
                        "description": "Arrive at hotel stay coordinates and drop bags."
                    })
                else:
                    hotel_name = selected_hotel_obj["name"] if selected_hotel_obj else "Accommodation"
                    day_schedule.append({
                        "name": f"Check-in at {hotel_name}",
                        "category": "logistics",
                        "start_time": "12:00",
                        "end_time": "13:00",
                        "cost_inr": 0.0,
                        "description": "Arrive at destination, complete check-in and drop luggage."
                    })
                    day_schedule.append({
                        "name": "Lunch Break (Local Eatery)",
                        "category": "food",
                        "start_time": "14:15",
                        "end_time": "15:00",
                        "cost_inr": 300.0,
                        "description": "Enjoy traditional regional food thali."
                    })

            # Day 2: Midway checkout & drive
            elif d == 1 and midway_hotel:
                dest_name = selected_hotel_obj["name"] if selected_hotel_obj else "Destination Stay"
                day_schedule.append({
                    "name": "Checkout from Midway Stay & Continue Road Route",
                    "category": "logistics",
                    "start_time": "08:00",
                    "end_time": "12:00",
                    "cost_inr": 0.0,
                    "description": "Depart midway stopover hotel and continue driving towards destination."
                })
                day_schedule.append({
                    "name": "Highway Dhaba Lunch Break",
                    "category": "food",
                    "start_time": "13:00",
                    "end_time": "14:00",
                    "cost_inr": 300.0,
                    "description": "Regional thali lunch break at NH highway food plaza."
                })
                day_schedule.append({
                    "name": f"Arrive & Check-in at Destination Hotel: {dest_name}",
                    "category": "logistics",
                    "start_time": "17:00",
                    "end_time": "18:00",
                    "cost_inr": 0.0,
                    "description": "Arrive at final destination city, check-in to destination stay."
                })
            else:
                if not (d == 0 and is_road_trip):
                    day_schedule.append({
                        "name": "Lunch Break (Local Eatery)",
                        "category": "food",
                        "start_time": "14:15",
                        "end_time": "15:00",
                        "cost_inr": 300.0,
                        "description": "Enjoy traditional regional food thali."
                    })

            # Attractions
            for i, a in enumerate(attraction_candidates):
                if solver.BooleanValue(x_a[(i, d)]):
                    start_val = solver.Value(start_time[i])
                    start_hrs = start_val // 60
                    start_mins = start_val % 60
                    start_time_str = f"{start_hrs:02d}:{start_mins:02d}"

                    end_val = start_val + int(a["duration_hrs"] * 60)
                    end_hrs = end_val // 60
                    end_mins = end_val % 60
                    end_time_str = f"{end_hrs:02d}:{end_mins:02d}"

                    day_schedule.append({
                        **a,
                        "start_time": start_time_str,
                        "end_time": end_time_str,
                        "start_minutes": start_val
                    })

            # Sort chronological
            day_schedule.sort(key=lambda x: x.get("start_minutes", 720))

            # Dinner
            day_schedule.append({
                "name": "Dinner & Rest (Local Restaurant)",
                "category": "food",
                "start_time": "20:00",
                "end_time": "21:30",
                "cost_inr": 300.0,
                "description": "Relax and enjoy dinner before returning to hotel."
            })

            if d == days - 1:
                day_schedule.append({
                    "name": "Checkout & Intercity Return Transit",
                    "category": "logistics",
                    "start_time": "21:30",
                    "end_time": "23:59",
                    "cost_inr": 0.0,
                    "description": "Wrap up checkout and board return transit."
                })

            itinerary["days"].append({
                "day_number": d + 1,
                "schedule": day_schedule
            })

    return itinerary
