using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace hahaton
{
    internal class PlanZdania
    {
        int[,,] Zdan3D;
        
        public PlanZdania() { }

        public void GetPlan(MyPlan plan)
        {
            MyLine[] lines = plan.myRooms.ToArray();
            int[] x1y1x2y2 = new int[4];
            List<int[]> xy = new List<int[]>();
            for (int i = 0; i < lines.Length; i++)
            {
                x1y1x2y2[0] = lines[i].x1;
                x1y1x2y2[1] = lines[i].y1;
                x1y1x2y2[2] = lines[i].x2;
                x1y1x2y2[3] = lines[i].y2;
                xy.Add(x1y1x2y2);
            }
        }
    }
}
