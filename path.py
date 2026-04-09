from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import networkx as nx
from typing import Dict, Tuple, List, Optional

app = FastAPI()

# Define rooms on both floors
rooms = {
    # Ground Floor
    "C101": "Staff Room (AEI)",
    "C102A": "Exam Cell (CSE)",
    "C102B": "Project Development Centre (CSE)",
    "C103": "Rest Room (M)",
    "C105": "Data Structures & Programming Lab (CSE)",
    "C106": "Rest Room (F)",
    "C107": "PG Lab (CSE)",
    "C108A": "Class Room (S1/S2, M.Tech CSE)",
    "C108B": "Class Room (S3/S4, M.Tech CSE)",
    "C109": "Class Room (S7/S8, CSE A)",
    "C110": "Class Room (S3/S4, AEI)",
    "C111": "Staff Room (CSE)",
    "EEG": "Emergency Exit (Ground Floor)",
    "C112": "Class Room (S5/S6, AEI)",
    "C113": "HOD Office (AEI)",
    "C114": "Class Room (S7/S8, AEI)",
    "C115": "Department Library (IT)",
    "Entrance": "Building Entrance",
    "BadmintonCourt": "Badminton Court",

    "Staircase_G": "Staircase (Ground Floor)",
    "Staircase_F": "Staircase (First Floor)",

    # First Floor
    "C202": "Seminar Hall (CSE)",
    "C203": "Staff Room (CSE)",
    "C204": "Rest Room",
    "C205": "Multicore Lab (IT)",
    "C206": "Staff Room (CSE)",
    "C206A": "Sick Room",
    "C206B": "UPS Room",
    "C207": "Programming Lab (IT)",
    "C208": "Systems Lab (CSE)",
    "C209": "Staff Room (CSE)",
    "C210": "Network Programming Lab (CSE)",
    "C211": "UPS Room",
    "EEF": "Emergency Exit (First Floor)",
    "C212": "Class Room (S5/S6, CSE B)",
    "C213": "HOD Office (CSE)",
    "C215": "Computer Lab-1 (MCA)"
}

# Graph Structure
building_graph = nx.Graph()

# Add Nodes for all rooms
for room in rooms.keys():
    building_graph.add_node(room)

# Add Edges for Ground Floor
building_graph.add_edges_from([
    ("Entrance", "C101", {'weight': 2}),
    ("Entrance", "BadmintonCourt", {'weight': 2}),
    ("Entrance", "C115", {'weight': 2}),
    ("Entrance", "Staircase_G", {'weight': 2}),
    ("C101", "Staircase_G", {'weight': 2}),
    ("C115", "Staircase_G", {'weight': 2}),
    ("BadmintonCourt", "Staircase_G", {'weight': 2}),
    ("C101", "C102A", {'weight': 1}),
    ("C101", "C102B", {'weight': 1}),
    ("C101", "C115", {'weight': 1}),
    ("C101", "BadmintonCourt", {'weight': 1}),
    ("C108B", "BadmintonCourt", {'weight': 1}),
    ("C115", "BadmintonCourt", {'weight': 1}),
    ("C102A", "C103", {'weight': 1}),
    ("C102B", "C103", {'weight': 1}),
    ("C102A", "C105", {'weight': 1}),
    ("C102B", "C105", {'weight': 1}),
    ("C105", "C107", {'weight': 1}),
    ("C105", "C106", {'weight': 1}),
    ("C106", "C107", {'weight': 1}),
    ("C107", "C108A", {'weight': 1}),
    ("C108A", "C108B", {'weight': 1}),
    ("C108B", "C109", {'weight': 1}),
    ("C109", "C110", {'weight': 1}),
    ("C110", "C111", {'weight': 1}),
    ("C110", "C112", {'weight': 1}),
    ("C111", "C112", {'weight': 1}),
    ("C112", "C114", {'weight': 1}),
    ("C113", "C114", {'weight': 1}),
    ("C114", "C115", {'weight': 1}),
    ("C111", "EEG", {'weight': 1})
])

# Add Edges for First Floor
building_graph.add_edges_from([
    ("C202", "C203", {'weight': 1}),
    ("C202", "C205", {'weight': 1}),
    ("C202", "C215", {'weight': 1}),
    ("C202", "Staircase_F", {'weight': 2}),
    ("C203", "C204", {'weight': 1}),
    ("C205", "C206", {'weight': 1}),
    ("C206", "C206A", {'weight': 1}),
    ("C206A", "C206B", {'weight': 1}),
    ("C206", "C207", {'weight': 1}),
    ("C207", "C208", {'weight': 1}),
    ("C208", "C209", {'weight': 1}),
    ("C209", "C210", {'weight': 1}),
    ("C210", "C211", {'weight': 1}),
    ("C211", "EEF", {'weight': 1}),
    ("C211", "C212", {'weight': 1}),
    ("C210", "C212", {'weight': 1}),
    ("C215", "C212", {'weight': 1}),
    ("C215", "C213", {'weight': 1}),
    ("C215", "Staircase_F", {'weight': 2})
])

# Connect Ground and First Floor using Staircases
building_graph.add_edges_from([
    ("Staircase_G", "Staircase_F", {'weight': 3})
])

# Path Segments Between Rooms (Directional)
path_segments_between_rooms: Dict[Tuple[str, str], List[str]] = {
    # Ground Floor
    ("C101", "Staircase_G"): ["rect29", "rect30", "rect31", "g91"],
    ("Staircase_G", "C101"): ["g91", "rect31", "rect30", "rect29"],
    ("C101", "C115"): ["rect29", "rect30", "rect31", "rect32", "rect33", "rect35", "rect36"],
    ("C115", "C101"): ["rect36", "rect35", "rect33", "rect32", "rect31", "rect30", "rect29"],
    ("C101", "C102A"): ["rect29", "rect28"],
    ("C102A", "C101"): ["rect28", "rect29"],
    ("C101", "C102B"): ["rect29", "rect28"],
    ("C102B", "C101"): ["rect28", "rect29"],
    ("C102A", "C103"): ["rect28", "rect27", "rect26"],
    ("C103", "C102A"): ["rect26", "rect27", "rect28"],
    ("C102B", "C103"): ["rect28", "rect27", "rect26"],
    ("C103", "C102B"): ["rect26", "rect27", "rect28"],
    ("C102A", "C105"): ["rect28", "rect67", "rect66"],
    ("C105", "C102A"): ["rect66", "rect67", "rect28"],
    ("C102B", "C105"): ["rect28", "rect67", "rect66"],
    ("C105", "C102B"): ["rect66", "rect67", "rect28"],
    ("C105", "C107"): ["rect66", "rect65", "rect43", "rect44", "rect45"],
    ("C107", "C105"): ["rect45", "rect44", "rect43", "rect65", "rect66"],
    ("C105", "C106"): ["rect66", "rect65", "rect43", "rect42", "rect41"],
    ("C106", "C105"): ["rect41", "rect42", "rect43", "rect65", "rect66"],
    ("C106", "C107"): ["rect41", "rect42", "rect43", "rect44", "rect45"],
    ("C107", "C106"): ["rect45", "rect44", "rect43", "rect42", "rect41"],
    ("C107", "C108A"): ["rect45", "rect46", "rect47"],
    ("C108A", "C107"): ["rect47", "rect46", "rect45"],
    ("C108A", "C108B"): ["rect47", "rect48", "rect49"],
    ("C108B", "C108A"): ["rect49", "rect48", "rect47"],
    ("C108B", "C109"): ["rect49", "rect50"],
    ("C109", "C108B"): ["rect50", "rect49"],
    ("C109", "C110"): ["rect50", "rect51", "rect52"],
    ("C110", "C109"): ["rect52", "rect51", "rect50"],
    ("C110", "C111"): ["rect52", "rect53", "rect54", "rect55"],
    ("C111", "C110"): ["rect55", "rect54", "rect53", "rect52"],
    ("C110", "C112"): ["rect52", "rect53", "rect57", "rect58"],
    ("C112", "C110"): ["rect58", "rect57", "rect53", "rect52"],
    ("C111", "EEG"): ["rect55", "rect56"],
    ("EEG", "C111"): ["rect56", "rect55"],
    ("C111", "C112"): ["rect55", "rect54", "rect53", "rect57", "rect58"],
    ("C112", "C111"): ["rect58", "rect57", "rect53", "rect54", "rect55"],
    ("C112", "C114"): ["rect58", "rect59", "rect38"],
    ("C114", "C112"): ["rect38", "rect59", "rect58"],
    ("C114", "C113"): ["rect38", "rect39", "rect40"],
    ("C113", "C114"): ["rect40", "rect39", "rect38"],
    ("C114", "C115"): ["rect38", "rect37", "rect36"],
    ("C115", "C114"): ["rect36", "rect37", "rect38"],
    ("Entrance", "Staircase_G"): ["rect64", "rect63", "rect33", "rect32", "rect31", "g91"],
    ("Staircase_G", "Entrance"): ["g91", "rect31", "rect32", "rect33", "rect63", "rect64"],
    ("Entrance", "C115"): ["rect64", "rect63", "rect33", "rect35", "rect36"],
    ("C115", "Entrance"): ["rect36", "rect35", "rect33", "rect63", "rect64"],
    ("Entrance", "BadmintonCourt"): ["rect64", "rect63", "rect33", "rect62", "rect60"],
    ("BadmintonCourt", "Entrance"): ["rect60", "rect62", "rect33", "rect63", "rect64"],
    ("C101", "BadmintonCourt"): ["rect29", "rect30", "rect31", "rect32", "rect33", "rect62", "rect60"],
    ("BadmintonCourt", "C101"): ["rect60", "rect62", "rect33", "rect32", "rect31", "rect30", "rect29"],
    ("C115", "BadmintonCourt"): ["rect36", "rect35", "rect33", "rect62", "rect60"],
    ("BadmintonCourt", "C115"): ["rect60", "rect62", "rect33", "rect35", "rect36"],
    ("BadmintonCourt", "Staircase_G"): ["rect60", "rect62", "rect33", "rect32", "rect31", "g91"],
    ("Staircase_G", "BadmintonCourt"): ["g91", "rect31", "rect32", "rect33", "rect62", "rect60"],
    ("C115", "Staircase_G"): ["rect36", "rect35", "rect33", "rect32", "rect31", "g91"],
    ("Staircase_G", "C115"): ["g91", "rect31", "rect32", "rect33", "rect35", "rect36"],
    ("BadmintonCourt", "C108B"): ["rect60", "rect61", "rect49"],
    ("C108B", "BadmintonCourt"): ["rect49", "rect61", "rect60"],

    # Staircases
    ("Staircase_G", "Staircase_F"): ["g91", "sf"],
    ("Staircase_F", "Staircase_G"): ["sf", "g91"],

    # First Floor
    ("C202", "C203"): ["p16", "p15", "p14"],
    ("C203", "C202"): ["p14", "p15", "p16"],
    ("C202", "C205"): ["p16", "p13"],
    ("C205", "C202"): ["p13", "p16"],
    ("C202", "C215"): ["p16", "p17", "p18", "p19", "p20"],
    ("C215", "C202"): ["p20", "p19", "p18", "p17", "p16"],
    ("C202", "Staircase_F"): ["p16", "p17", "p18", "sf"],
    ("Staircase_F", "C202"): ["sf", "p18", "p17", "p16"],
    ("C203", "C204"): ["p14"],
    ("C204", "C203"): ["p14"],
    ("C205", "C206"): ["p13", "p12", "p1"],
    ("C206", "C205"): ["p1", "p12", "p13"],
    ("C206", "C206A"): ["p1"],
    ("C206A", "C206"): ["p1"],
    ("C206A", "C206B"): ["p1"],
    ("C206B", "C206A"): ["p1"],
    ("C206", "C207"): ["p1", "p2"],
    ("C207", "C206"): ["p2", "p1"],
    ("C207", "C208"): ["p2", "p3", "p4"],
    ("C208", "C207"): ["p4", "p3", "p2"],
    ("C208", "C209"): ["p4", "p101"],
    ("C209", "C208"): ["p101", "p4"],
    ("C209", "C210"): ["p101", "p5", "p6"],
    ("C210", "C209"): ["p6", "p5", "p101"],
    ("C210", "C211"): ["p6", "p7", "p8", "p9", "p10"],
    ("C211", "C210"): ["p10", "p9", "p8", "p7", "p6"],
    ("C211", "EEF"): ["p10", "p11"],
    ("EEF", "C211"): ["p11", "p10"],
    ("C210", "C212"): ["p6", "p7", "p8", "p23", "p24"],
    ("C212", "C210"): ["p24", "p23", "p8", "p7", "p6"],
    ("C211", "C212"): ["p10", "p9", "p8", "p23", "p24"],
    ("C212", "C211"): ["p24", "p23", "p8", "p9", "p10"],
    ("C212", "C215"): ["p24", "p20"],
    ("C215", "C212"): ["p20", "p24"],
    ("C215", "C213"): ["p20", "p21", "p22"],
    ("C213", "C215"): ["p22", "p21", "p20"],
    ("C215", "Staircase_F"): ["p20", "p19", "p18", "sf"],
    ("Staircase_F", "C215"): ["sf", "p18", "p19", "p20"]
}

class PathRequest(BaseModel):
    source: str
    destination: str

@app.get("/rooms")
def get_rooms():
    return [{"room_id": room, "name": name} for room, name in rooms.items()]

@app.post("/shortest-path")
def get_shortest_path(request: PathRequest):
    source = request.source
    destination = request.destination

    if source not in building_graph or destination not in building_graph:
        raise HTTPException(status_code=404, detail="Room not found")

    if source == destination:
        return {
            "rooms": [source],
            "path_segments": [],
            "first_segment": None,
            "last_segment": None
        }

    try:
        room_path = nx.shortest_path(building_graph, source=source, target=destination, weight='weight')
        path_segments = []
        seen_segments = set()

        for i in range(len(room_path) - 1):
            room1, room2 = room_path[i], room_path[i + 1]

            # Check both directions for segments
            forward_segments = path_segments_between_rooms.get((room1, room2))
            reverse_segments = path_segments_between_rooms.get((room2, room1))

            if forward_segments:
                # Use segments in original order
                for segment in forward_segments:
                    if segment not in seen_segments:
                        path_segments.append(segment)
                        seen_segments.add(segment)
            elif reverse_segments:
                # Reverse segments to maintain walking direction
                for segment in reversed(reverse_segments):
                    if segment not in seen_segments:
                        path_segments.append(segment)
                        seen_segments.add(segment)
            else:
                print(f"Warning: No segments defined for {room1}-{room2} or {room2}-{room1}")

        first_segment = path_segments[0] if path_segments else None
        last_segment = path_segments[-1] if path_segments else None

        return {
            "rooms": room_path,
            "path_segments": path_segments,
            "first_segment": first_segment,
            "last_segment": last_segment
        }

    except nx.NetworkXNoPath:
        raise HTTPException(status_code=404, detail="No path found between the rooms")