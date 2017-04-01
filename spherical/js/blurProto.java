for (int i = 1; i < (dna_src.length); i++)
		{
			blur(dna_src[i - 1].getPixels(), dna_src[i].getPixels(), dna_w, i);
		}

		private void blur(int src[], int dst[], int w, int amount)
		{
		System.arraycopy(src, 0, dst, 0, src.length);

		for (int y = 1; y < (src.length / w) - 1; y++) //w = 150
		{
			int offset = y*w + 2;
			int p2 = dst[offset - w - 2];
			int p3 = dst[offset - w - 1];
			int p5 = dst[offset - 2];
			int p6 = dst[offset - 1];
			int p8 = dst[offset + w - 2];
			int p9 = dst[offset + w - 1];
			offset--;

			for (int x = 1; x < w - 1; x++)
			{
				float distance_sq = (x - w / 2) * (x - w / 2) + (y - src.length / w / 2) * (y - src.length / w / 2); 

				int p1 = p2;
				p2 = p3;
				p3 = dst[offset - w + 1];
				int p4 = p5;
				p5 = p6;
				p6 = dst[offset + 1];
				int p7 = p8;
				p8 = p9;
				p9 = dst[offset + w + 1];

				int rsum = (p1 & 0xff0000) + (p2 & 0xff0000) + (p3 & 0xff0000) + 
						   (p4 & 0xff0000) + (p5 & 0xff0000) + (p6 & 0xff0000) +
						   (p7 & 0xff0000) + (p8 & 0xff0000) + (p9 & 0xff0000);
				int gsum = (p1 & 0x00ff00) + (p2 & 0x00ff00) + (p3 & 0x00ff00) + 
						   (p4 & 0x00ff00) + (p5 & 0x00ff00) + (p6 & 0x00ff00) +
						   (p7 & 0x00ff00) + (p8 & 0x00ff00) + (p9 & 0x00ff00);
				int bsum = (p1 & 0x0000ff) + (p2 & 0x0000ff) + (p3 & 0x0000ff) + 
						   (p4 & 0x0000ff) + (p5 & 0x0000ff) + (p6 & 0x0000ff) +
						   (p7 & 0x0000ff) + (p8 & 0x0000ff) + (p9 & 0x0000ff);

				float div = distance_sq / 80000 + 9;
				rsum /= div;
				gsum /= div;
				bsum /= div;

				if( distance_sq < ((amount-1) * 1000) )
				{
					dst[offset] = dna_src[amount-1].getPixels()[offset];
					offset++;
				}
				else
				{
					dst[offset++] = 0xff000000 | (rsum & 0xff0000) | (gsum & 0xff00) | (bsum & 0xff);
				}
			}
		}
	}