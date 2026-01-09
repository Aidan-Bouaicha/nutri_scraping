def build_meal_plan(profile, macros, foods):
    return {
        "petit_dejeuner": foods[:2],
        "dejeuner": foods[2:4],
        "diner": foods[4:6],
        "macros_cibles": macros
    }
