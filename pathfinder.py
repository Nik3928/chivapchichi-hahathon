from queue import PriorityQueue
from graph import Graph
from line import Line
from point import Point

goal_a = "14-8-0"
goal_b = "40-0-0"
goal_c = "23-3-1"
goal_d = "13-6-1"
goal_e = "23-8-1"

start = "0-0-0"

graph_a = Graph((46,16,2))
for i in range(8):
    graph_a.add_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),0)
for i in range(13):
    graph_a.add_wall(Line(Point(14+i,7.5),Point(15+i,7.5)),0)

graph_b_c = Graph((46,16,2))
for i in range(19):
    graph_b_c.add_wall(Line(Point(27+i,7.5),Point(28+i,7.5)),0)
for i in range(7):
    graph_b_c.add_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
for i in range(8):
    graph_b_c.add_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),1)
for i in range(23):
    graph_b_c.add_wall(Line(Point(23+i,7.5),Point(24+i,7.5)),1)

graph_d_e = Graph((46,16,2))
for i in range(23):
    graph_d_e.add_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),0)
for i in range(8):
    graph_d_e.add_wall(Line(Point(26.5,8+i),Point(26.5,9+i)),0)
for i in range(7):
    graph_d_e.add_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
for i in range(7):
    graph_d_e.add_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),0)
for i in range(7):
    graph_d_e.add_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),1)
for i in range(23):
    graph_d_e.add_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),1)
for i in range(8):
    graph_d_e.add_wall(Line(Point(23.5,8+i),Point(23.5,9+i)),1)
for i in range(8):
    graph_d_e.add_wall(Line(Point(29.5,8+i),Point(29.5,9+i)),1)

def find(graph,start,goal):
    frontier = PriorityQueue()
    frontier.put(start, 0)
    came_from = dict()
    cost_so_far = dict()
    came_from[start] = None
    cost_so_far[start] = 0

    found = False

    while not frontier.empty():
        current = frontier.get()

        if current == goal:
            found = True
        
        for next in graph.neighbors(current):
            new_cost = cost_so_far[current] + graph.cost(current, next)
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost
                priority = new_cost
                frontier.put(next, priority)
                came_from[next] = current

    current = goal
    print("="*50)
    print(f"From {goal} to {start}") 
    if found:
        print(current)
        while not current == start:
            current = came_from[current]
            print(current)
    else:
        print("Not found")
    

for onegr in (graph_a,graph_b_c,graph_d_e):
    for onegoal in (goal_a,goal_b,goal_c,goal_d,goal_e):
        find(onegr,start,onegoal)