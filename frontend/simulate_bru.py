import math

class ScarabSimulation:
    def __init__(self):
        self.total_pool = 300_000_000
        self.daily_budget_0 = 61554
        self.decay_rate = 0.99979484
        
        self.solar_annual_bru = 2400
        self.bokashi_annual_bru = 650
        
        self.scenarios = [
            {'year': 1, 'solar_nodes': 1000, 'bokashi_nodes': 2000},
            {'year': 2, 'solar_nodes': 3000, 'bokashi_nodes': 10000},
            {'year': 3, 'solar_nodes': 10000, 'bokashi_nodes': 40000},
            {'year': 4, 'solar_nodes': 25000, 'bokashi_nodes': 100000},
            {'year': 5, 'solar_nodes': 50000, 'bokashi_nodes': 200000},
            {'year': 7, 'solar_nodes': 100000, 'bokashi_nodes': 500000},
            {'year': 10, 'solar_nodes': 250000, 'bokashi_nodes': 1000000},
        ]

    def run(self):
        print("--- SCARAB 10-YEAR BRU GROWTH SIMULATION ---")
        print(f"Initial Daily Budget: {self.daily_budget_0:,.0f} SCARAB")
        print(f"Decay Rate: {self.decay_rate}")
        print(f"Solar Base: {self.solar_annual_bru} BRU/yr | Bokashi Base: {self.bokashi_annual_bru} BRU/yr\n")
        
        print("| Year | Active Solar Nodes | Active Bokashi Nodes | Total Network BRU | Year Budget | Solar Yield/Yr | Bokashi Yield/Yr |")
        print("|---|---|---|---|---|---|---|")
        
        for s in self.scenarios:
            year = s['year']
            solar_nodes = s['solar_nodes']
            bokashi_nodes = s['bokashi_nodes']
            
            day = (year-1) * 365
            year_budget = 0
            
            day_budget = self.daily_budget_0 * (self.decay_rate ** day)
            
            for _ in range(365):
                year_budget += day_budget
                day_budget *= self.decay_rate
                            
            total_solar_bru = solar_nodes * self.solar_annual_bru
            total_bokashi_bru = bokashi_nodes * self.bokashi_annual_bru
            total_network_bru = total_solar_bru + total_bokashi_bru
            
            solar_yield = (self.solar_annual_bru / total_network_bru) * year_budget if total_network_bru > 0 else 0
            bokashi_yield = (self.bokashi_annual_bru / total_network_bru) * year_budget if total_network_bru > 0 else 0
            
            print(f"| Year {year} | {solar_nodes:,} | {bokashi_nodes:,} | {total_network_bru:,.0f} BRU | {year_budget:,.0f} SCARAB | {solar_yield:,.0f} SCARAB | {bokashi_yield:,.0f} SCARAB |")

sim = ScarabSimulation()
sim.run()
