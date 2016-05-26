precision highp float;

uniform sampler2D uX;

uniform int uN;
uniform int uB;

varying vec2 vTextureCoord;

void main(void) {

	float h = 1.0 / float(uN);

	float mult = 2.0;

	// for ( i=1 ; i<=N ; i++ ) {
	// 	x[IX(0  ,i)] = b==1 ? -x[IX(1,i)] : x[IX(1,i)];
	// 	x[IX(N+1,i)] = b==1 ? -x[IX(N,i)] : x[IX(N,i)];
	// 	x[IX(i,0  )] = b==2 ? -x[IX(i,1)] : x[IX(i,1)];
	// 	x[IX(i,N+1)] = b==2 ? -x[IX(i,N)] : x[IX(i,N)];
	// }
	// x[IX(0  ,0  )] = 0.5f*(x[IX(1,0  )]+x[IX(0  ,1)]);
	// x[IX(0  ,N+1)] = 0.5f*(x[IX(1,N+1)]+x[IX(0  ,N)]);
	// x[IX(N+1,0  )] = 0.5f*(x[IX(N,0  )]+x[IX(N+1,1)]);
	// x[IX(N+1,N+1)] = 0.5f*(x[IX(N,N+1)]+x[IX(N+1,N)]);

	vec3 color = texture2D(uX, vTextureCoord).rgb;
	float rightPoint = h * float(uN);
	if (vTextureCoord.s < h){
		float val = (texture2D(uX, vec2(h, vTextureCoord.s)).r - .5) * mult;
		if (uB == 1){
			color.r -= val;
		}else if (uB == 2){
			color.r += val;
		}
	}else if (vTextureCoord.s >= rightPoint){


	}
	

	// float topVal = (texture2D(uP, vec2(vTextureCoord.s, vTextureCoord.t - h )).r -.5) * mult;
	// float bottomVal = (texture2D(uP, vec2(vTextureCoord.s, vTextureCoord.t + h)).r -.5) * mult;
	// float leftVal = (texture2D(uP, vec2(vTextureCoord.s - h, vTextureCoord.t)).r -.5) * mult;
	// float rightVal = (texture2D(uP, vec2(vTextureCoord.s + h, vTextureCoord.t)).r -.5) * mult;
	// float divVal = (texture2D(uDiv, vTextureCoord).r -.5) * mult;

	// float color = (divVal + leftVal + rightVal + topVal + bottomVal) / 4.0;

	color += .5;

    gl_FragColor = vec4(color, color, color, 1.0);
  
}