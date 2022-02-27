using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace hahaton
{
    internal class DravPlan
    {
        int x1, x2, y1, y2, masht, w, l;
        Graphics gr;
        public DravPlan(Graphics gr , int l, int w, int panelL, int panelW)
        { 
            this.gr = gr;
            this.w = w;
            this.l = l;

            if (l > w)
                masht = panelL/l;
            else
                masht = panelW/w;
        }
        Pen penBlack = new Pen(Color.Black, 8);
        Pen penGray = new Pen(Color.Gray);
        Pen penRed = new Pen(Color.Red);
        Pen penGreen = new Pen(Color.Green);
        Brush brushGreen = new SolidBrush(Color.Green);
        Brush brushOrange = new SolidBrush(Color.Orange);

        public void DrawLineBlack(int x1, int x2, int y1, int y2)
        {
            gr.DrawLine(penBlack, x1, y1, x2, y2);
        }

        public void DrawLineRed(int x1, int x2, int y1, int y2)
        {
            gr.DrawLine(penRed, x1, y1, x2, y2);
        } 

        public void DrawLineGreen(int x1, int x2, int y1, int y2)
        {
            gr.DrawLine(penGreen, x1, y1, x2, y2);
        }

        public void DrawSource(int x, int y)
        {
            gr.FillRectangle(brushGreen, x, y, masht, masht);
        }

        public void DrawConsumer(int x, int y)
        {
            gr.FillRectangle(brushOrange, x, y, masht, masht);
        }

        public void DrawPlan(MyPlan plan)
        {
            //MyRectangle source = plan.source;
            //MyRectangle[] consumers = plan.consumer.ToArray();
            List<MyLine> lines = plan.myRooms;
            //DrawSource(source.X, source.Y);
            foreach (MyLine line in lines)
            {
                if (line.status == 0) 
                    DrawLineBlack(line.x1, line.y1, line.x2, line.y2);
                else 
                    DrawLineRed(line.x1,line.y1, line.x2, line.y2);
            }
            //foreach (MyRectangle rectangle in consumers)
            //{
            //    DrawConsumer(rectangle.X, rectangle.Y);
            //}
        }

        public void DrawTable()
        {
            x1 = x2 = y1 = y2 = 0;
            for (int i = 0; i <= l; i++)
            {
                gr.DrawLine(penGray, x1 + i * masht, y1, x2 + i * masht, y2 + w * masht);
            }
            for (int i = 0;i <= w; i++)
            {
                gr.DrawLine(penGray, x1, y1 + i * masht, x2 + l * masht, y2 + i * masht);
            }
            
        }
        public int[,,] GetTable()
        {
            int[,,] table = new int[l + 1, w + 1, 2];
            int x = 0, y = 0;
            for (int i = 0; i <= l; i++)
                for (int j = 0; j <= w; j++)
                {
                    table[i, j, 0] = x + i * masht;
                    table[i, j, 1] = y + j * masht;
                }
            return table;
        }
    }
}
