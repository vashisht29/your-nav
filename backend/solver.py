from ortools.sat.python import cp_model

CLASS_MULTIPLIERS = {
    "economy": 1.0,
    "premium": 1.5,
    "first_class": 1.8
}

PACE_CONFIG = {
    "relaxed": {
        "max_sights_normal": 2,
        "max_sights_road": 1,
        "travel_buffer_min": 45
    },
    "moderate": {
        "max_sights_normal": 3,
        "max_sights_road": 2,
        "travel_buffer_min": 30
    },
    "hectic": {
        "max_sights_normal": 5,
        "max_sights_road": 3,
        "travel_buffer_min": 15
    }
}

def parse_time(val) -> int:
    if not val:
        return 540 # Default 09:00 AM in minutes
    val_str = str(val).strip().lower()
    if "-" in val_str:
        val_str = val_str.split("-")[0].strip()
    try:
        if "pm" in val_str:
            parts = val_str.replace("pm", "").strip().split(":")
            hrs = int(parts[0])
            mins = int(parts[1]) if len(parts) > 1 else 0
            if hrs < 12:
                hrs += 12
            return hrs * 60 + mins
        elif "am" in val_str:
            parts = val_str.replace("am", "").strip().split(":")
            hrs = int(parts[0])
            mins = int(parts[1]) if len(parts) > 1 else 0
            if hrs == 12:
                hrs = 0
            return hrs * 60 + mins
        else:
            parts = val_str.split(":")
            hrs = int(parts[0])
            mins = int(parts[1]) if len(parts) > 1 else 0
            return hrs * 60 + mins
    except Exception:
        return 540 # Safe fallback on format errors

def calculate_trip_cost(transit_base, hotel_base, nights, rooms, days, group_size, travel_class="economy", tolls=0, attractions=0):
    mult = CLASS_MULTIPLIERS.get(travel_class, 1.0)
    transit_cost = int(transit_base * mult)
    toll_cost = int(tolls)  # Tolls are NOT multiplied by travel class
    hotel_cost = int(hotel_base * nights * rooms)
    food_cost = int(600 * group_size * days)
    return {
        "transit": transit_cost,
        "hotel": hotel_cost,
        "food": food_cost,
        "toll": toll_cost,
        "activities": int(attractions),
        "total": transit_cost + hotel_cost + food_cost + toll_cost + int(attractions)
    }

def solve_itinerary(days, budget, hotel_candidates, attraction_candidates, restaurant_candidates, transit_estimate, group_size, midway_hotel=None, travel_class="economy", toll_cost=0, pace="moderate", lang="en"):
    """
    Solves for the optimal itinerary using Google OR-Tools CP-SAT.
    """
    num_nights = days
    rooms_needed = max(1, (group_size + 1) // 2)

    p_cfg = PACE_CONFIG.get(pace, PACE_CONFIG["moderate"])

    DESCRIPTIONS = {
        "en": {
            "start_drive": "Depart from starting city origin and begin driving on the highway.",
            "tea_stop": "Short break to rest, stretch, and get tea/snacks.",
            "highway_lunch": "Stop for fresh local regional lunch on the highway.",
            "arrive_hotel": "Arrive at hotel stay coordinates and drop bags.",
            "checkin": "Arrive at destination, complete check-in and drop luggage.",
            "lunch": "Enjoy traditional regional food thali.",
            "midway_checkout": "Depart midway stopover hotel and continue driving towards destination.",
            "midway_lunch": "Regional thali lunch break at NH highway food plaza.",
            "midway_arrive": "Arrive at final destination city, check-in to destination stay.",
            "dinner": "Relax and enjoy dinner before returning to hotel.",
            "checkout": "Wrap up checkout and board return transit."
        },
        "hi": {
            "start_drive": "शुरुआती शहर से निकलें और हाईवे पर ड्राइव शुरू करें।",
            "tea_stop": "आराम करने, चाय-नाश्ता लेने के लिए छोटा ब्रेक।",
            "highway_lunch": "हाईवे पर ताज़ा स्थानीय भोजन के लिए रुकें।",
            "arrive_hotel": "होटल पहुँचें और सामान रखें।",
            "checkin": "गंतव्य पर पहुँचें, चेक-इन करें और सामान रखें।",
            "lunch": "पारंपरिक स्थानीय भोजन थाली का आनंद लें।",
            "midway_checkout": "मिडवे होटल से चेकआउट करें और गंतव्य की ओर ड्राइव जारी रखें।",
            "midway_lunch": "NH हाईवे फूड प्लाज़ा पर रीजनल थाली लंच ब्रेक।",
            "midway_arrive": "अंतिम गंतव्य शहर पहुँचें, डेस्टिनेशन होटल में चेक-इन करें।",
            "dinner": "होटल लौटने से पहले डिनर का आनंद लें।",
            "checkout": "चेकआउट करें और वापसी ट्रांज़िट बोर्ड करें।"
        }
    }
    desc = DESCRIPTIONS.get(lang, DESCRIPTIONS["en"])

    # 1. Pre-Solver Feasibility Check
    min_hotel_nightly = min(int(h["cost_inr"]) for h in hotel_candidates) if hotel_candidates else 0
    baseline_calc = calculate_trip_cost(
        transit_base=transit_estimate["cost_inr"],
        hotel_base=min_hotel_nightly,
        nights=num_nights,
        rooms=rooms_needed,
        days=days,
        group_size=group_size,
        travel_class=travel_class,
        tolls=toll_cost,
        attractions=0
    )

    if baseline_calc["total"] > budget:
        return {
            "status": "Infeasible",
            "reason": "BUDGET_TOO_LOW",
            "message": f"Your selected travel class and accommodations exceed the available ₹{budget} budget.",
            "minimum_required_budget": baseline_calc["total"],
            "user_budget": budget,
            "cost_breakdown": baseline_calc,
            "days": []
        }

    model = cp_model.CpModel()

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
        is_road_day = (d == 0 or (d == 1 and midway_hotel))
        max_sights = p_cfg["max_sights_road"] if is_road_day else p_cfg["max_sights_normal"]
        model.Add(sum(x_a[(i, d)] for i in range(len(attraction_candidates))) <= max_sights)

    # Opening hours constraints
    for i, a in enumerate(attraction_candidates):
        open_min = int(a.get("opening_hour", 9) * 60)
        close_min = int(a.get("closing_hour", 18) * 60)
        dur_min = int(a.get("duration_hrs", 2) * 60)

        model.Add(start_time[i] >= open_min)
        model.Add(start_time[i] + dur_min <= close_min)

    # Overlap protection
    travel_buffer = p_cfg["travel_buffer_min"]
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
    mult = CLASS_MULTIPLIERS.get(travel_class, 1.0)
    is_self_drive = transit_estimate.get("mode", "self-drive") == "self-drive"
    if is_self_drive:
        transit_fare_cost = int(transit_estimate["cost_inr"] * mult)
    else:
        transit_fare_cost = int(transit_estimate["cost_inr"] * mult * group_size)
        
    toll_cost_fixed = int(toll_cost)  # Tolls stay constant regardless of class

    total_cost = model.NewIntVar(0, int(budget) * 100, 'total_cost')
    model.Add(total_cost == (hotel_cost_sum + attraction_cost_sum + food_cost + transit_fare_cost + toll_cost_fixed))
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
        "cost_breakdown": {},
        "explanation": ""
    }

    if status != cp_model.OPTIMAL and status != cp_model.FEASIBLE:
        # Diagnostic analysis for infeasible options
        min_hotel = min(int(h["cost_inr"]) for h in hotel_candidates) * num_nights * rooms_needed if hotel_candidates else 0
        min_transit = transit_fare_cost + toll_cost_fixed
        min_food = food_cost
        absolute_min = min_hotel + min_transit + min_food
        
        if absolute_min > budget:
            itinerary["explanation"] = (
                f"Conflict: Your budget of ₹{budget} is insufficient. "
                f"The absolute minimum required cost is ₹{absolute_min} "
                f"(Hotel Stay: ₹{min_hotel}, Transit: ₹{min_transit}, Food/Dhabas: ₹{min_food}). "
                f"Please increase your budget or reduce travelers."
            )
        else:
            itinerary["explanation"] = (
                "Conflict: Time constraints overlap. The selected transit duration "
                f"({transit_estimate.get('duration_hrs', 0)} hrs) leaves insufficient open hours "
                f"for the planned attractions within their opening/closing windows. "
                "Recommend extending trip duration or reducing the number of attractions."
            )
        return itinerary

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
            "transport": transit_fare_cost,
            "toll": toll_cost_fixed,
            "food": food_cost,
            "activities": float(solver.Value(attraction_cost_sum)),
            "allocated_budget": budget,
            "remaining_balance": budget - float(solver.Value(total_cost))
        }

        mode = transit_estimate.get("mode", "self-drive")
        is_road_trip = (mode == "self-drive")
        is_multi_leg = transit_estimate.get("is_multi_leg", False)

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
                        "description": desc["start_drive"]
                    })
                    day_schedule.append({
                        "name": "Highway Tea & Rest Stop Plaza",
                        "category": "logistics",
                        "start_time": "11:30",
                        "end_time": "12:00",
                        "cost_inr": 100.0,
                        "description": desc["tea_stop"]
                    })
                    day_schedule.append({
                        "name": "Roadside Dhaba Highway Lunch",
                        "category": "food",
                        "start_time": "13:30",
                        "end_time": "14:30",
                        "cost_inr": 300.0,
                        "description": desc["highway_lunch"]
                    })
                    hotel_name = midway_hotel["name"] if midway_hotel else (selected_hotel_obj["name"] if selected_hotel_obj else "Destination Hotel")
                    day_schedule.append({
                        "name": f"Arrive & Check-in at {hotel_name}",
                        "category": "logistics",
                        "start_time": "17:30",
                        "end_time": "18:30",
                        "cost_inr": 0.0,
                        "description": desc["arrive_hotel"]
                    })
                else:
                    # Non self-drive options (Flight/Train/Bus)
                    checkin_start = "12:00"
                    
                    if mode == "flight":
                        airline_name = transit_estimate.get("airline") or "Commercial Flight"
                        fl_num = transit_estimate.get("flight_number") or "FL-101"
                        dep_t = transit_estimate.get("departure_time") or "08:00"
                        arr_t = transit_estimate.get("arrival_time") or "10:30"
                        
                        day_schedule.append({
                            "name": f"🛫 Flight Transit: {airline_name} ({fl_num})",
                            "category": "logistics",
                            "start_time": dep_t,
                            "end_time": arr_t,
                            "cost_inr": 0.0,
                            "start_minutes": parse_time(dep_t),
                            "description": f"Fly from origin to nearest hub airport: {transit_estimate.get('destination_airport') or 'DHM'}."
                        })
                        
                        arr_hrs = int(arr_t.split(":")[0])
                        arr_mins = int(arr_t.split(":")[1])
                        
                        if is_multi_leg:
                            taxi_start_min = arr_hrs * 60 + arr_mins + 45
                            taxi_start_t = f"{(taxi_start_min // 60) % 24:02d}:{taxi_start_min % 60:02d}"
                            
                            taxi_end_min = taxi_start_min + 90
                            taxi_end_t = f"{(taxi_end_min // 60) % 24:02d}:{taxi_end_min % 60:02d}"
                            
                            day_schedule.append({
                                "name": "🚕 Ground Connection: Airport Taxi Transfer",
                                "category": "logistics",
                                "start_time": taxi_start_t,
                                "end_time": taxi_end_t,
                                "cost_inr": 0.0,
                                "start_minutes": taxi_start_min,
                                "description": f"Includes 45-min connection buffer. Take taxi from airport terminal to final destination hotel stay. Connection note: {transit_estimate.get('accessibility_note') or ''}"
                            })
                            checkin_start = taxi_end_t
                        else:
                            checkin_min = arr_hrs * 60 + arr_mins + 45
                            checkin_start = f"{(checkin_min // 60) % 24:02d}:{checkin_min % 60:02d}"

                    elif mode == "train":
                        tr_name = transit_estimate.get("train_name") or "Express Train"
                        tr_num = transit_estimate.get("train_number") or "12002"
                        day_schedule.append({
                            "name": f"🚊 Train Transit: {tr_name} ({tr_num})",
                            "category": "logistics",
                            "start_time": transit_estimate.get("departure_time") or "07:00",
                            "end_time": transit_estimate.get("arrival_time") or "11:30",
                            "cost_inr": 0.0,
                            "start_minutes": parse_time(transit_estimate.get("departure_time") or "07:00"),
                            "description": "Board intercity train transit towards destination station."
                        })
                        arr_t = transit_estimate.get("arrival_time") or "11:30"
                        arr_hrs = int(arr_t.split(":")[0])
                        arr_mins = int(arr_t.split(":")[1])
                        checkin_min = arr_hrs * 60 + arr_mins + 30
                        checkin_start = f"{(checkin_min // 60) % 24:02d}:{checkin_min % 60:02d}"

                    elif mode == "bus":
                        operator = transit_estimate.get("operator") or "State Bus"
                        b_type = transit_estimate.get("bus_type") or "AC Sleeper"
                        day_schedule.append({
                            "name": f"🚌 Bus Transit: {operator} ({b_type})",
                            "category": "logistics",
                            "start_time": transit_estimate.get("departure_time") or "07:30",
                            "end_time": transit_estimate.get("arrival_time") or "11:45",
                            "cost_inr": 0.0,
                            "start_minutes": parse_time(transit_estimate.get("departure_time") or "07:30"),
                            "description": "Travel by sleeper coach bus towards destination highway plaza."
                        })
                        arr_t = transit_estimate.get("arrival_time", "11:45")
                        arr_hrs = int(arr_t.split(":")[0])
                        arr_mins = int(arr_t.split(":")[1])
                        checkin_min = arr_hrs * 60 + arr_mins + 30
                        checkin_start = f"{(checkin_min // 60) % 24:02d}:{checkin_min % 60:02d}"

                    hotel_name = selected_hotel_obj["name"] if selected_hotel_obj else "Accommodation"
                    ch_h = int(checkin_start.split(":")[0])
                    ch_m = int(checkin_start.split(":")[1])
                    checkin_end_min = ch_h * 60 + ch_m + 60
                    checkin_end = f"{(checkin_end_min // 60) % 24:02d}:{checkin_end_min % 60:02d}"
                    
                    day_schedule.append({
                        "name": f"🏨 Check-in at {hotel_name}",
                        "category": "logistics",
                        "start_time": checkin_start,
                        "end_time": checkin_end,
                        "cost_inr": 0.0,
                        "start_minutes": parse_time(checkin_start),
                        "description": desc["checkin"]
                    })
                    day_schedule.append({
                        "name": "Lunch Break (Local Eatery)",
                        "category": "food",
                        "start_time": "14:15",
                        "end_time": "15:00",
                        "cost_inr": 300.0,
                        "start_minutes": parse_time("14:15"),
                        "description": desc["lunch"]
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
                    "description": desc["midway_checkout"]
                })
                day_schedule.append({
                    "name": "Highway Dhaba Lunch Break",
                    "category": "food",
                    "start_time": "13:00",
                    "end_time": "14:00",
                    "cost_inr": 300.0,
                    "description": desc["midway_lunch"]
                })
                day_schedule.append({
                    "name": f"Arrive & Check-in at Destination Hotel: {dest_name}",
                    "category": "logistics",
                    "start_time": "17:00",
                    "end_time": "18:00",
                    "cost_inr": 0.0,
                    "description": desc["midway_arrive"]
                })
            else:
                if not (d == 0 and is_road_trip):
                    day_schedule.append({
                        "name": "Lunch Break (Local Eatery)",
                        "category": "food",
                        "start_time": "14:15",
                        "end_time": "15:00",
                        "cost_inr": 300.0,
                        "description": desc["lunch"]
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
                "description": desc["dinner"]
            })

            if d == days - 1:
                if is_road_trip:
                    day_schedule.append({
                        "name": "Checkout & Intercity Return Transit",
                        "category": "logistics",
                        "start_time": "21:30",
                        "end_time": "23:59",
                        "cost_inr": 0.0,
                        "start_minutes": parse_time("21:30"),
                        "description": desc["checkout"]
                    })
                else:
                    if mode == "flight":
                        airline_name = transit_estimate.get("airline") or "Commercial Flight"
                        fl_num = transit_estimate.get("flight_number") or "FL-102"
                        
                        if is_multi_leg:
                            day_schedule.append({
                                "name": "🚕 Ground Connection: Taxi to Airport",
                                "category": "logistics",
                                "start_time": "17:00",
                                "end_time": "18:30",
                                "cost_inr": 0.0,
                                "start_minutes": parse_time("17:00"),
                                "description": f"Take taxi from hotel in destination back to {transit_estimate.get('destination_airport') or 'DHM'} airport terminal."
                            })
                            day_schedule.append({
                                "name": f"🛫 Return Flight Transit: {airline_name} ({fl_num})",
                                "category": "logistics",
                                "start_time": "20:00",
                                "end_time": "22:30",
                                "cost_inr": 0.0,
                                "start_minutes": parse_time("20:00"),
                                "description": "Board flight back to origin airport."
                            })
                        else:
                            day_schedule.append({
                                "name": f"🛫 Return Flight Transit: {airline_name} ({fl_num})",
                                "category": "logistics",
                                "start_time": "18:00",
                                "end_time": "21:00",
                                "cost_inr": 0.0,
                                "start_minutes": parse_time("18:00"),
                                "description": "Board flight back to origin airport."
                            })
                    elif mode == "train":
                        tr_name = transit_estimate.get("train_name") or "Express Train"
                        day_schedule.append({
                            "name": f"🚊 Return Train Transit: {tr_name}",
                            "category": "logistics",
                            "start_time": "17:30",
                            "end_time": "22:00",
                            "cost_inr": 0.0,
                            "start_minutes": parse_time("17:30"),
                            "description": "Board return train transit back to origin railway terminal."
                        })
                    elif mode == "bus":
                        operator = transit_estimate.get("operator") or "State Bus"
                        day_schedule.append({
                            "name": f"🚌 Return Bus Transit: {operator}",
                            "category": "logistics",
                            "start_time": "18:00",
                            "end_time": "22:30",
                            "cost_inr": 0.0,
                            "start_minutes": parse_time("18:00"),
                            "description": "Board coach bus back to origin."
                        })

            itinerary["days"].append({
                "day_number": d + 1,
                "schedule": day_schedule
            })

    return itinerary
