from datetime import datetime, timezone

CROP_REQUIREMENTS = {
    "Wheat": {
        "ideal_n": (60, 100), "ideal_p": (30, 60), "ideal_k": (30, 60),
        "ideal_temp": (15, 25), "ideal_humidity": (40, 60), "ideal_ph": (6.0, 7.5),
        "harvest_days": 120,
        "base_yield_per_plot_kg": 500,
        "best_rotations": [
            {"crop": "Soybeans", "reason": "Nitrogen-fixing legume restores soil layers actively depleted by heavy-feeding predecessors."},
            {"crop": "Potatoes", "reason": "Root crops naturally aerate soil densities and interrupt standard shallow pest life cycles."}
        ] 
    },
    "Corn": {
        "ideal_n": (100, 150), "ideal_p": (40, 80), "ideal_k": (60, 100),
        "ideal_temp": (20, 30), "ideal_humidity": (50, 70), "ideal_ph": (5.8, 7.0),
        "harvest_days": 150,
        "base_yield_per_plot_kg": 800,
        "best_rotations": [
            {"crop": "Soybeans", "reason": "Nitrogen-fixing legume restores massive nutrient withdrawals typical of Corn yielding."},
            {"crop": "Cotton", "reason": "Deep-rooted structure accesses underlying soil moisture unutilized by Corn's shallower root mat."}
        ]
    },
    "Rice": {
        "ideal_n": (80, 120), "ideal_p": (40, 60), "ideal_k": (40, 60),
        "ideal_temp": (20, 35), "ideal_humidity": (60, 80), "ideal_ph": (5.5, 6.5),
        "harvest_days": 130,
        "base_yield_per_plot_kg": 600,
        "best_rotations": [
            {"crop": "Wheat", "reason": "Excellent dry-cycle variant utilizing residual soil moisture following flooded rice harvesting."},
            {"crop": "Soybeans", "reason": "Interrupts aquatic pest cycles while restoring structural nitrogen densities natively."}
        ]
    },
    "Soybeans": {
        "ideal_n": (20, 40), "ideal_p": (40, 60), "ideal_k": (60, 80),
        "ideal_temp": (20, 30), "ideal_humidity": (50, 70), "ideal_ph": (6.0, 7.0),
        "harvest_days": 100,
        "base_yield_per_plot_kg": 300,
        "best_rotations": [
            {"crop": "Corn", "reason": "Heavy nitrogen feeder perfectly slated to aggressively consume the excess nitrogen fixed by the Soybeans."},
            {"crop": "Wheat", "reason": "Strong dense-planting variant that suppresses leftover weed structures from Soybean canopies."},
            {"crop": "Cotton", "reason": "Thrives beautifully leveraging the soil nitrogen residue."}
        ] 
    },
    "Potatoes": {
        "ideal_n": (80, 120), "ideal_p": (60, 100), "ideal_k": (100, 150),
        "ideal_temp": (15, 20), "ideal_humidity": (50, 70), "ideal_ph": (5.0, 6.0),
        "harvest_days": 90,
        "base_yield_per_plot_kg": 1000,
        "best_rotations": [
            {"crop": "Wheat", "reason": "Fibrous root systems help rebind and stabilize soils loosened extensively by aggressive potato harvesting."},
            {"crop": "Corn", "reason": "Aggressive above-ground weed suppression via broad leaf canopies protects potato soil residue."}
        ]
    },
    "Cotton": {
        "ideal_n": (100, 140), "ideal_p": (40, 60), "ideal_k": (60, 80),
        "ideal_temp": (25, 35), "ideal_humidity": (40, 60), "ideal_ph": (5.8, 8.0),
        "harvest_days": 160,
        "base_yield_per_plot_kg": 400,
        "best_rotations": [
            {"crop": "Soybeans", "reason": "Crucial rotational legume injected to return bio-available nitrogen back after Cotton's strenuous feeding cycle."}
        ]
    }
}

def analyze_crop_performance(crop_type: str, n: float, p: float, k: float, temp: float, hum: float, ph: float, created_at: datetime):
    if crop_type not in CROP_REQUIREMENTS:
        return None
        
    reqs = CROP_REQUIREMENTS[crop_type]
    
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
        
    now = datetime.now(timezone.utc)
    days_passed = (now - created_at).days
    days_to_harvest = max(0, reqs["harvest_days"] - days_passed)
    progress_percent = min(100, int((days_passed / reqs["harvest_days"]) * 100))
    
    score = 1.0
    penalties = []
    
    base_kg = reqs["base_yield_per_plot_kg"]
    
    # Calculate detailed explicit penalties dynamically
    def apply_penalty(name, ideal, actual, weight):
        nonlocal score, penalties
        if not (ideal[0] <= actual <= ideal[1]):
            score -= weight
            loss_kg = int(base_kg * weight)
            penalties.append({"metric": name, "impact_kg": -loss_kg, "reason": f"Level {actual} violates threshold bounds [{ideal[0]} to {ideal[1]}]"})

    apply_penalty("Temperature", reqs["ideal_temp"], temp, 0.15)
    
    if n < reqs["ideal_n"][0]:
        score -= 0.1
        loss = int(base_kg * 0.1)
        penalties.append({"metric": "Nitrogen Deficit", "impact_kg": -loss, "reason": f"Nitrogen {n} starves required floor {reqs['ideal_n'][0]}"})
    elif n > reqs["ideal_n"][1]:
        score -= 0.05
        loss = int(base_kg * 0.05)
        penalties.append({"metric": "Nitrogen Toxic", "impact_kg": -loss, "reason": f"Nitrogen {n} over-saturates max {reqs['ideal_n'][1]}"})
        
    if p < reqs["ideal_p"][0]:
        score -= 0.1
        loss = int(base_kg * 0.1)
        penalties.append({"metric": "Phosphorus Deficit", "impact_kg": -loss, "reason": f"Phosphorus {p} is beneath required floor {reqs['ideal_p'][0]}"})
        
    if k < reqs["ideal_k"][0]:
        score -= 0.1
        loss = int(base_kg * 0.1)
        penalties.append({"metric": "Potassium Deficit", "impact_kg": -loss, "reason": f"Potassium {k} is beneath required floor {reqs['ideal_k'][0]}"})

    if ph is not None:
        apply_penalty("pH Level", reqs["ideal_ph"], ph, 0.10)
        
    apply_penalty("Humidity", reqs["ideal_humidity"], hum, 0.10)
    
    # Floor to absolute minimum 20%
    score = max(0.2, score) 
    predicted_yield = int(base_kg * score)
    
    ideal_bounds = {k: v for k, v in reqs.items() if k.startswith("ideal_")}
    
    return {
        "days_to_harvest": days_to_harvest,
        "progress_percent": progress_percent,
        "base_yield_kg": base_kg,
        "predicted_yield_kg": predicted_yield,
        "health_score_percent": int(score * 100),
        "recommended_rotation": reqs["best_rotations"],
        "penalties": penalties,
        "ideal_bounds": ideal_bounds
    }
