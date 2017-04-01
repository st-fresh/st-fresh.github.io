            Point p1, p2;
           








            float fx, fy, u, d, min_d = Integer.MAX_VALUE, dx, dy;
            int min_index = 0;
            for (int i = 0; i < controls.length; i++)
            {
                p1 = controls[i][0];
                p2 = controls[i][1];
                dx = p2.x - p1.x;
                dy = p2.y - p1.y;
                d = (float) Math.sqrt(dx * dx + dy * dy);
                u = ( (bx - p1.x) * (p2.x - p1.x) + (by - p1.y) * (p2.y - p1.y) ) / (d * d);
                fx = p1.x + u * (p2.x - p1.x);
                fy = p1.y + u * (p2.y - p1.y);
                if (fx >= 0 && fx < spectrum_r.width)
                {
                    dx = bx - fx;
                    dy = by - fy;
                    d = (float) Math.sqrt(dx * dx + dy * dy);
                    if (d < min_d)
                    {
                        min_d = d;
                        min_index = i;
                    }
                }
            }

            int order_index = 0;

            for (int i = 0; i < order_color_boundaries.length - 1; i++)
            {
                if (bx >= order_color_boundaries[i] && bx <= order_color_boundaries[i + 1])
                {
                    order_index = i;
                    break;
                }
            }

            int thickness_index = 0;

            for (int i = thickness.length - 1; i > 0; i--)
            {
                if (by <= thickness[i].x && by >= thickness[i - 1].x)
                {
                    thickness_index = i;
                    break;
                }
            }

            float thick_value = thickness[thickness_index].y 
            + (thickness[thickness_index - 1].y - thickness[thickness_index].y) 
            * (by - thickness[thickness_index].x) / (float) (thickness[thickness_index - 1].x - thickness[thickness_index].x);
            
    String s = "" + (int) (birefringence[min_index] * 1000) / 1000f, t; //(int) so floor/round

    if (s.charAt(s.length() - 1) == '0')
    {
        s = s.substring(0, s.length() - 1);
    }
    gr.drawString(t = labels[4]     , x - fm.stringWidth(t) / 2, y + 12); //labels[4] = ??
    gr.drawString(s                 , x - fm.stringWidth(s) / 2, y + 24 + 2);

    x += 80;

    if (thick_value < 0.01)
    {
        t = "" + (int) (thick_value * 1000) / 1000f; //(int) so floor/round
        if (t.charAt(t.length() - 1) == '0' && !t.equals("0.0"))
        {
            t = t.substring(0, t.length() - 1);
        }
        t += " " + labels[6]; //labels[6] = ??
    }
    else
    {
        t = (int) (thick_value * 100) / 100f + " " + labels[6]; //label[6] = mm //(int) so floor/round
    }

            gr.drawString(s = labels[5]      , x - fm.stringWidth(s) / 2, y + 12);
            gr.drawString(t                  , x - fm.stringWidth(t) / 2, y + 24 + 2);

            int path_index = 0;
            for (int i = 0; i < path_difference.length - 1; i++)
            {
                if (bx >= path_difference[i].x && bx <= path_difference[i + 1].x)
                {
                    path_index = i;
                    break;
                }
            }
            float path_value = path_difference[path_index].y + (path_difference[path_index + 1].y - path_difference[path_index].y) * (bx - path_difference[path_index].x) / (float) (path_difference[path_index + 1].x - path_difference[path_index].x);
            x += 80;

            gr.drawString(s = labels[7]                                     , x - fm.stringWidth(s) / 2, y);
            gr.drawString(s = labels[8]                                     , x - fm.stringWidth(s) / 2, y + 12);
            gr.drawString(s = "" + (int) path_value + " " + labels[9]       , x - fm.stringWidth(s) / 2, y + 26);
            gr.drawString(s = order_names[order_index] + " " + labels[12]   , x - fm.stringWidth(s) / 2, y + 40);

            x += 80;
            gr.drawString(s = labels[10]     , x - fm.stringWidth(s) / 2, y + 2);
            gr.drawString(s = labels[11]     , x - fm.stringWidth(s) / 2, y + 12 + 2);