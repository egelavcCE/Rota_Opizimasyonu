import math
from typing import List, Tuple, Dict

class RouteModel:
    def __init__(self, start_point: Tuple[float, float]):
        """
        Initialize the route model with a starting point
        :param start_point: Tuple of (latitude, longitude)
        """
        self.start_point = start_point
        self.stops = []
        self.route = []
        
    def add_stop(self, address: str, coordinates: Tuple[float, float]):
        """
        Add a stop to the list of locations
        :param address: Address of the stop
        :param coordinates: Tuple of (latitude, longitude)
        """
        self.stops.append({
            'address': address,
            'coordinates': coordinates,
            'visited': False
        })
        
    def calculate_distance(self, point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """
        Calculate the distance between two points using the Haversine formula
        :param point1: Tuple of (latitude, longitude)
        :param point2: Tuple of (latitude, longitude)
        :return: Distance in kilometers
        """
        lat1, lon1 = point1
        lat2, lon2 = point2
        
        R = 6371  # Earth's radius in kilometers
        
        # Convert latitude and longitude to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c
        
    def find_nearest_stop(self, current_point: Tuple[float, float]) -> Dict:
        """
        Find the nearest unvisited stop from the current point
        :param current_point: Tuple of (latitude, longitude)
        :return: Dictionary containing stop information
        """
        min_distance = float('inf')
        nearest_stop = None
        
        for stop in self.stops:
            if not stop['visited']:
                distance = self.calculate_distance(current_point, stop['coordinates'])
                if distance < min_distance:
                    min_distance = distance
                    nearest_stop = stop
                    
        return nearest_stop
        
    def optimize_route(self) -> List[Dict]:
        """
        Optimize the route using the nearest neighbor algorithm
        :return: List of stops in optimized order
        """
        self.route = []
        current_point = self.start_point
        
        # Reset visited status
        for stop in self.stops:
            stop['visited'] = False
            
        # Find the optimal route
        while len(self.route) < len(self.stops):
            nearest = self.find_nearest_stop(current_point)
            if nearest:
                nearest['visited'] = True
                self.route.append(nearest)
                current_point = nearest['coordinates']
                
        return self.route
        
    def get_optimized_route(self) -> List[str]:
        """
        Get the optimized route as a list of addresses
        :return: List of addresses in optimized order
        """
        return [stop['address'] for stop in self.route] 