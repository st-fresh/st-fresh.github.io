var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,
278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,
271,269,267,265,263,261,259],shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,
23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];
function stackBlurCanvasRGBA(I,N,O,B,J,A){if(!(isNaN(A)||1>A)){A|=0;I=document.getElementById(I).getContext("2d");var K;try{try{K=I.getImageData(N,O,B,J)}catch(T){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"),K=I.getImageData(N,O,B,J)}catch(R){throw alert("Cannot access local image"),Error("unable to access local image data: "+R);}}}catch(S){throw alert("Cannot access image"),Error("unable to access image data: "+S);}var c=K.data,v,G,b,d,e,L,g,h,k,l,w,x,y,z,n,p,q,
r,s,t,u,f,C;v=A+A+1;var M=B-1,P=J-1,m=A+1,D=m*(m+1)/2,H=new BlurStack,a=H;for(b=1;b<v;b++)if(a=a.next=new BlurStack,b==m)var Q=a;a.next=H;a=b=null;L=e=0;var E=mul_table[A],F=shg_table[A];for(G=0;G<J;G++){n=p=q=r=g=h=k=l=0;w=m*(s=c[e]);x=m*(t=c[e+1]);y=m*(u=c[e+2]);z=m*(f=c[e+3]);g+=D*s;h+=D*t;k+=D*u;l+=D*f;a=H;for(b=0;b<m;b++)a.r=s,a.g=t,a.b=u,a.a=f,a=a.next;for(b=1;b<m;b++)d=e+((M<b?M:b)<<2),g+=(a.r=s=c[d])*(C=m-b),h+=(a.g=t=c[d+1])*C,k+=(a.b=u=c[d+2])*C,l+=(a.a=f=c[d+3])*C,n+=s,p+=t,q+=u,r+=f,a=
a.next;b=H;a=Q;for(v=0;v<B;v++)c[e+3]=f=l*E>>F,0!=f?(f=255/f,c[e]=(g*E>>F)*f,c[e+1]=(h*E>>F)*f,c[e+2]=(k*E>>F)*f):c[e]=c[e+1]=c[e+2]=0,g-=w,h-=x,k-=y,l-=z,w-=b.r,x-=b.g,y-=b.b,z-=b.a,d=L+((d=v+A+1)<M?d:M)<<2,n+=b.r=c[d],p+=b.g=c[d+1],q+=b.b=c[d+2],r+=b.a=c[d+3],g+=n,h+=p,k+=q,l+=r,b=b.next,w+=s=a.r,x+=t=a.g,y+=u=a.b,z+=f=a.a,n-=s,p-=t,q-=u,r-=f,a=a.next,e+=4;L+=B}for(v=0;v<B;v++){p=q=r=n=h=k=l=g=0;e=v<<2;w=m*(s=c[e]);x=m*(t=c[e+1]);y=m*(u=c[e+2]);z=m*(f=c[e+3]);g+=D*s;h+=D*t;k+=D*u;l+=D*f;a=H;for(b=
0;b<m;b++)a.r=s,a.g=t,a.b=u,a.a=f,a=a.next;d=B;for(b=1;b<=A;b++)e=d+v<<2,g+=(a.r=s=c[e])*(C=m-b),h+=(a.g=t=c[e+1])*C,k+=(a.b=u=c[e+2])*C,l+=(a.a=f=c[e+3])*C,n+=s,p+=t,q+=u,r+=f,a=a.next,b<P&&(d+=B);e=v;b=H;a=Q;for(G=0;G<J;G++)d=e<<2,c[d+3]=f=l*E>>F,0<f?(f=255/f,c[d]=(g*E>>F)*f,c[d+1]=(h*E>>F)*f,c[d+2]=(k*E>>F)*f):c[d]=c[d+1]=c[d+2]=0,g-=w,h-=x,k-=y,l-=z,w-=b.r,x-=b.g,y-=b.b,z-=b.a,d=v+((d=G+m)<P?d:P)*B<<2,g+=n+=b.r=c[d],h+=p+=b.g=c[d+1],k+=q+=b.b=c[d+2],l+=r+=b.a=c[d+3],b=b.next,w+=s=a.r,x+=t=a.g,
y+=u=a.b,z+=f=a.a,n-=s,p-=t,q-=u,r-=f,a=a.next,e+=B}I.putImageData(K,N,O)}}function BlurStack(){this.a=this.b=this.g=this.r=0;this.next=null};