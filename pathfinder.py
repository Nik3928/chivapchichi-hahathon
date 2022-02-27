from queue import PriorityQueue
from re import L
from graph import Graph
from line import Line
from point import Point

class PF:
    def __init__(self,sizes,heights,walls):
        self.walls = walls
        #self.source = data['source']
        #self.receivers = data['receivers']
        self.sizes = sizes
        self.heights = heights

        self.graph = Graph(self.sizes,self.heights)
        for wall in self.walls:
            if wall[1] == wall[3]:
                # horizontal wall
                self.graph.add_wall(Line(
                    Point(wall[0],wall[1]-0.5),
                    Point(wall[2],wall[3]-0.5),
                ),
                wall[4])
            if wall[0] == wall[2]:
                # vertical wall
                self.graph.add_wall(Line(
                    Point(wall[0]-0.5,wall[1]),
                    Point(wall[2]-0.5,wall[3]),
                ),
                wall[4])

    def find(self,start,goal,walls=False):
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
            
            for next in self.graph.neighbors(current,walls):
                new_cost = cost_so_far[current] + self.graph.cost(current, next)
                if next not in cost_so_far or new_cost < cost_so_far[next]:
                    cost_so_far[next] = new_cost
                    priority = new_cost
                    frontier.put(next, priority)
                    came_from[next] = current

        current = goal
        arr = []
        # print("="*50)
        # print(f"From {goal} to {start}") 
        if found:
            # print(current)
            goal_tmp = goal.split('-')
            arr.append((int(goal_tmp[0]),int(goal_tmp[1]),int(goal_tmp[2])))
            while not current == start:
                current = came_from[current]
                # print(current)
                current_tmp = current.split('-')
                arr.append((int(current_tmp[0]),int(current_tmp[1]),int(current_tmp[2])))
            return cost_so_far[goal],arr[::-1]
        else:
            # print("Not found")
            return 0,None

if __name__ == "__main__":
    goal_a = "14-8-0"
    goal_b = "40-0-0"
    goal_c = "23-3-1"
    goal_d = "13-6-1"
    goal_e = "23-8-1"

    start = "0-0-0"

    graph_a = Graph((46,16,2))
    #Restrictions
    graph_a.add_wall(Line(Point(13.5,8),Point(13.5,16)),0)
    graph_a.add_wall(Line(Point(14,7.5),Point(27,7.5)),0)
    #Borders
    graph_a.add_wall(Line(Point(0,-0.5),Point(46,-0.5)),0)
    graph_a.add_wall(Line(Point(0,15.5),Point(46,15.5)),0)
    graph_a.add_wall(Line(Point(0,-0.5),Point(46,-0.5)),1)
    graph_a.add_wall(Line(Point(0,15.5),Point(46,15.5)),1)
    graph_a.add_wall(Line(Point(-0.5,0),Point(-0.5,16)),0)
    graph_a.add_wall(Line(Point(45.5,0),Point(45.5,16)),0)
    graph_a.add_wall(Line(Point(-0.5,0),Point(-0.5,16)),1)
    graph_a.add_wall(Line(Point(45.5,0),Point(45.5,16)),1)
    # #Walkable walls
    # for i in range(8):
    #     graph_a.add_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),0)
    # for i in range(13):
    #     graph_a.add_wall(Line(Point(14+i,7.5),Point(15+i,7.5)),0)
    # for i in range(46):
    #     graph_a.add_wall(Line(Point(0+i,-0.5),Point(1+i,-0.5)),0)
    #     graph_a.add_wall(Line(Point(0+i,15.5),Point(1+i,15.5)),0)
    #     graph_a.add_wall(Line(Point(0+i,-0.5),Point(1+i,-0.5)),1)
    #     graph_a.add_wall(Line(Point(0+i,15.5),Point(1+i,15.5)),1)
    #     graph_a.add_walkable_wall(Line(Point(0+i,6.5),Point(1+i,6.5)),0)
    #     graph_a.add_walkable_wall(Line(Point(0+i,6.5),Point(1+i,6.5)),1)
    #     graph_a.add_walkable_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),0)
    #     graph_a.add_walkable_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),1)
    # for i in range(16):
    #     graph_a.add_wall(Line(Point(-0.5,0+i),Point(-0.5,1+i)),0)
    #     graph_a.add_wall(Line(Point(45.5,0+i),Point(45.5,1+i)),0)
    #     graph_a.add_wall(Line(Point(-0.5,0+i),Point(-0.5,1+i)),1)
    #     graph_a.add_wall(Line(Point(45.5,0+i),Point(45.5,1+i)),1)
    # for i in range(7):
    #     graph_a.add_walkable_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),0)
    #     graph_a.add_walkable_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
    #     graph_a.add_walkable_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),1)
    #     graph_a.add_walkable_wall(Line(Point(22.5,0+i),Point(22.5,1+i)),1)
    #     graph_a.add_walkable_wall(Line(Point(29.5,0+i),Point(29.5,1+i)),1)
    # for i in range(8):
    #     graph_a.add_walkable_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),0)
    #     graph_a.add_walkable_wall(Line(Point(26.5,8+i),Point(26.5,9+i)),0)
    #     graph_a.add_walkable_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),1)
    #     graph_a.add_walkable_wall(Line(Point(22.5,8+i),Point(22.5,9+i)),1)
    #     graph_a.add_walkable_wall(Line(Point(29.5,8+i),Point(29.5,9+i)),1)

    graph_b_c = Graph((46,16,2))
    #Restrictions
    graph_b_c.add_wall(Line(Point(27,7.5),Point(46,7.5)),0)
    graph_b_c.add_wall(Line(Point(26.5,0),Point(26.5,7)),0)
    graph_b_c.add_wall(Line(Point(13.5,8),Point(13.5,16)),1)
    graph_b_c.add_wall(Line(Point(23,7.5),Point(46,7.5)),1)
    #Borders
    graph_b_c.add_wall(Line(Point(0,-0.5),Point(46,-0.5)),0)
    graph_b_c.add_wall(Line(Point(0,15.5),Point(46,15.5)),0)
    graph_b_c.add_wall(Line(Point(0,-0.5),Point(46,-0.5)),1)
    graph_b_c.add_wall(Line(Point(0,15.5),Point(46,15.5)),1)
    graph_b_c.add_wall(Line(Point(-0.5,0),Point(-0.5,16)),0)
    graph_b_c.add_wall(Line(Point(45.5,0),Point(45.5,16)),0)
    graph_b_c.add_wall(Line(Point(-0.5,0),Point(-0.5,16)),1)
    graph_b_c.add_wall(Line(Point(45.5,0),Point(45.5,16)),1)
    # for i in range(19):
    #     graph_b_c.add_wall(Line(Point(27+i,7.5),Point(28+i,7.5)),0)
    # for i in range(7):
    #     graph_b_c.add_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
    # for i in range(8):
    #     graph_b_c.add_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),1)
    # for i in range(23):
    #     graph_b_c.add_wall(Line(Point(23+i,7.5),Point(24+i,7.5)),1)
    # for i in range(46):
    #     graph_b_c.add_wall(Line(Point(0+i,-0.5),Point(1+i,-0.5)),0)
    #     graph_b_c.add_wall(Line(Point(0+i,15.5),Point(1+i,15.5)),0)
    #     graph_b_c.add_wall(Line(Point(0+i,-0.5),Point(1+i,-0.5)),1)
    #     graph_b_c.add_wall(Line(Point(0+i,15.5),Point(1+i,15.5)),1)
    #     graph_b_c.add_walkable_wall(Line(Point(0+i,6.5),Point(1+i,6.5)),0)
    #     graph_b_c.add_walkable_wall(Line(Point(0+i,6.5),Point(1+i,6.5)),1)
    #     graph_b_c.add_walkable_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),0)
    #     graph_b_c.add_walkable_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),1)
    # for i in range(16):
    #     graph_b_c.add_wall(Line(Point(-0.5,0+i),Point(-0.5,1+i)),0)
    #     graph_b_c.add_wall(Line(Point(45.5,0+i),Point(45.5,1+i)),0)
    #     graph_b_c.add_wall(Line(Point(-0.5,0+i),Point(-0.5,1+i)),1)
    #     graph_b_c.add_wall(Line(Point(45.5,0+i),Point(45.5,1+i)),1)
    # for i in range(7):
    #     graph_b_c.add_walkable_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),0)
    #     graph_b_c.add_walkable_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
    #     graph_b_c.add_walkable_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),1)
    #     graph_b_c.add_walkable_wall(Line(Point(22.5,0+i),Point(22.5,1+i)),1)
    #     graph_b_c.add_walkable_wall(Line(Point(29.5,0+i),Point(29.5,1+i)),1)
    # for i in range(8):
    #     graph_b_c.add_walkable_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),0)
    #     graph_b_c.add_walkable_wall(Line(Point(26.5,8+i),Point(26.5,9+i)),0)
    #     graph_b_c.add_walkable_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),1)
    #     graph_b_c.add_walkable_wall(Line(Point(22.5,8+i),Point(22.5,9+i)),1)
    #     graph_b_c.add_walkable_wall(Line(Point(29.5,8+i),Point(29.5,9+i)),1)

    graph_d_e = Graph((46,16,2))
    #Restrictions
    graph_d_e.add_wall(Line(Point(0,7.5),Point(23,7.5)),0)
    graph_d_e.add_wall(Line(Point(26.5,8),Point(26.5,16)),0)
    graph_d_e.add_wall(Line(Point(26.5,0),Point(26.5,7)),0)
    graph_d_e.add_wall(Line(Point(13.5,0),Point(13.5,7)),0)
    graph_d_e.add_wall(Line(Point(13.5,0),Point(13.5,7)),1)
    graph_d_e.add_wall(Line(Point(0,7.5),Point(23,7.5)),1)
    graph_d_e.add_wall(Line(Point(23.5,8),Point(23.5,16)),1)
    graph_d_e.add_wall(Line(Point(29.5,8),Point(29.5,16)),1)
    #Borders
    graph_d_e.add_wall(Line(Point(0,-0.5),Point(46,-0.5)),0)
    graph_d_e.add_wall(Line(Point(0,15.5),Point(46,15.5)),0)
    graph_d_e.add_wall(Line(Point(0,-0.5),Point(46,-0.5)),1)
    graph_d_e.add_wall(Line(Point(0,15.5),Point(46,15.5)),1)
    graph_d_e.add_wall(Line(Point(-0.5,0),Point(-0.5,16)),0)
    graph_d_e.add_wall(Line(Point(45.5,0),Point(45.5,16)),0)
    graph_d_e.add_wall(Line(Point(-0.5,0),Point(-0.5,16)),1)
    graph_d_e.add_wall(Line(Point(45.5,0),Point(45.5,16)),1)
    # for i in range(23):
    #     graph_d_e.add_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),0)
    # for i in range(8):
    #     graph_d_e.add_wall(Line(Point(26.5,8+i),Point(26.5,9+i)),0)
    # for i in range(7):
    #     graph_d_e.add_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
    # for i in range(7):
    #     graph_d_e.add_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),0)
    # for i in range(7):
    #     graph_d_e.add_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),1)
    # for i in range(23):
    #     graph_d_e.add_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),1)
    # for i in range(8):
    #     graph_d_e.add_wall(Line(Point(23.5,8+i),Point(23.5,9+i)),1)
    # for i in range(8):
    #     graph_d_e.add_wall(Line(Point(29.5,8+i),Point(29.5,9+i)),1)
    # for i in range(46):
    #     graph_d_e.add_wall(Line(Point(0+i,-0.5),Point(1+i,-0.5)),0)
    #     graph_d_e.add_wall(Line(Point(0+i,15.5),Point(1+i,15.5)),0)
    #     graph_d_e.add_wall(Line(Point(0+i,-0.5),Point(1+i,-0.5)),1)
    #     graph_d_e.add_wall(Line(Point(0+i,15.5),Point(1+i,15.5)),1)
    #     graph_d_e.add_walkable_wall(Line(Point(0+i,6.5),Point(1+i,6.5)),0)
    #     graph_d_e.add_walkable_wall(Line(Point(0+i,6.5),Point(1+i,6.5)),1)
    #     graph_d_e.add_walkable_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),0)
    #     graph_d_e.add_walkable_wall(Line(Point(0+i,7.5),Point(1+i,7.5)),1)
    # for i in range(16):
    #     graph_d_e.add_wall(Line(Point(-0.5,0+i),Point(-0.5,1+i)),0)
    #     graph_d_e.add_wall(Line(Point(45.5,0+i),Point(45.5,1+i)),0)
    #     graph_d_e.add_wall(Line(Point(-0.5,0+i),Point(-0.5,1+i)),1)
    #     graph_d_e.add_wall(Line(Point(45.5,0+i),Point(45.5,1+i)),1)
    # for i in range(7):
    #     graph_d_e.add_walkable_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),0)
    #     graph_d_e.add_walkable_wall(Line(Point(26.5,0+i),Point(26.5,1+i)),0)
    #     graph_d_e.add_walkable_wall(Line(Point(13.5,0+i),Point(13.5,1+i)),1)
    #     graph_d_e.add_walkable_wall(Line(Point(22.5,0+i),Point(22.5,1+i)),1)
    #     graph_d_e.add_walkable_wall(Line(Point(29.5,0+i),Point(29.5,1+i)),1)
    # for i in range(8):
    #     graph_d_e.add_walkable_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),0)
    #     graph_d_e.add_walkable_wall(Line(Point(26.5,8+i),Point(26.5,9+i)),0)
    #     graph_d_e.add_walkable_wall(Line(Point(13.5,8+i),Point(13.5,9+i)),1)
    #     graph_d_e.add_walkable_wall(Line(Point(22.5,8+i),Point(22.5,9+i)),1)
    #     graph_d_e.add_walkable_wall(Line(Point(29.5,8+i),Point(29.5,9+i)),1)
    

    for onegr in (graph_a,graph_b_c,graph_d_e):
        for onegoal in (goal_a,goal_b,goal_c,goal_d,goal_e):
            find(onegr,start,onegoal)