using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace hahaton
{
    public partial class Form1 : Form
    {
        int numb, width, length, colKab, colConsumer, x_curs, y_curs;
        int[,] table;
        int[,,] tableCoordinates;
        int[] xy_click_curs;
        DravPlan dravPlan;
        MyPlan[] myPalubas;
        RadioButton[] palubsSelect;
        GroupBox groupBox;
        Graphics gr;
        Pen penBlue = new Pen(Color.Blue, 3);
        bool flag_click = true;

        public Form1()
        {
            InitializeComponent();
        }

        private void panel1_MouseMove(object sender, MouseEventArgs e)
        {
            gr.Clear(Color.White);
            dravPlan.DrawTable();
            dravPlan.DrawPlan(myPalubas[0]);
            int r = 10;
            int x_curs = e.X;
            int y_curs = e.Y;
            for (int i = 0; i < tableCoordinates.GetLength(0); i++)
                for (int j = 0; j < tableCoordinates.GetLength(1); j++)
                    if (x_curs >= tableCoordinates[i, j, 0] - r / 2 && y_curs >= tableCoordinates[i, j, 1] - r / 2 && x_curs <= tableCoordinates[i, j, 0] + r / 2 && y_curs <= tableCoordinates[i, j, 1] + r / 2)
                    {
                        gr.DrawEllipse(penBlue, tableCoordinates[i, j, 0] - r / 2, tableCoordinates[i, j, 1] - r / 2, r, r);
                        xy_click_curs[0] = tableCoordinates[i, j, 0];
                        xy_click_curs[1] = tableCoordinates[i, j, 1];
                    }
        }

        private void panel1_MouseClick(object sender, MouseEventArgs e)
        {
            if (flag_click)
            {
                x_curs = xy_click_curs[0];
                y_curs = xy_click_curs[1];
                flag_click = false;
            }
            else
            {
                dravPlan.DrawLineBlack(x_curs, y_curs, xy_click_curs[0], xy_click_curs[1]);
                myPalubas[0].SetLine(x_curs, y_curs, xy_click_curs[0], xy_click_curs[1], 0);
                flag_click =true;
            }
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
            dravPlan.DrawTable();
            tableCoordinates = dravPlan.GetTable();
        }

        private void button_exit_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Initialize();
            gr = panel1.CreateGraphics();
            dravPlan = new DravPlan(gr, length, width, panel1.Width, panel1.Height);
            table = new int[length, width];
            tableCoordinates = new int[length, width,2];
            xy_click_curs = new int[2];
            timer1.Start();
        }
        public void Click_radioButt_PalubSelect()
        {

        }
        public bool Initialize()
        {
            try
            {
                bool returnn = false;
                int popitka = 0;
                do
                {
                    try
                    {
                        popitka++;
                        InputBox inputBoxL = new InputBox("Сбор данных", "Введите Длинну палубы", true);
                        InputBox inputBoxW = new InputBox("Сбор данных", "Введите Ширину палубы", true);
                        InputBox inputBoxN = new InputBox("Сбор данных", "Введите количество палуб", true);
                        InputBox inputBoxColKab = new InputBox("Сбор данных", "Введите количество кабелей", true);
                        InputBox inputBoxColConsum = new InputBox("Сбор данных", "Введите количество потребителей", true);
                        length = Convert.ToInt32(inputBoxL.GetString());
                        width = Convert.ToInt32(inputBoxW.GetString());
                        numb = Convert.ToInt32(inputBoxN.GetString());
                        colKab = Convert.ToInt32(inputBoxColKab.GetString());
                        colConsumer = Convert.ToInt32(inputBoxColConsum.GetString());
                        if (numb * width * length * colKab * colConsumer != 0) { returnn = false; }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message);
                        returnn = true;
                    }
                } while (returnn && popitka < 3);

                if (popitka >= 3)       { Close(); }
                if (numb > 10)          { numb = 10; }
                if (colKab > 10)        { colKab = 10; }
                if (colConsumer > 10)   { colConsumer = 10; }
                if (width > 100)     { width = 100; }
                if (length > 100)    { length = 100; }

                myPalubas = new MyPlan[numb];

                groupBox = new GroupBox
                {
                    Name = "groupBoxPalub",
                    Parent = this,
                    Location = new Point(12, 12),
                    Size = new Size(37, (17 + 6) * numb)
                };
                this.Controls.Add(groupBox);

                palubsSelect = new RadioButton[numb];
                int x = 0, y = 0;
                for (int i = 0; i < numb; i++)
                {
                    palubsSelect[i] = new RadioButton
                    {
                        Name = "palubSelect" + (i+1).ToString(),
                        Parent = groupBox,
                        Location = new Point(x, y),
                        Text = i.ToString(),
                    };
                    y += 17 + 6;
                }
                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                return false;
            }
        }
    }
}
