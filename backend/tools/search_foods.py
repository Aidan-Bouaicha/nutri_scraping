from service.food_service import search_foods

def search_foods_tool(query):
    return search_foods(query)[:5]
