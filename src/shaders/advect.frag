precision highp float;

uniform sampler2D uD;
uniform sampler2D uD0;
uniform sampler2D uVel;

uniform int uN;
uniform float uDt;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	float N = float(uN);

	float textureOffset = 1.0 / (N + 2.0);

	// float multiplier = 2.0;
	float normalizer = 0.5;

	int i,j,k;
	float dt0 = uDt * N;
	// float dt0 = uDt;

	float color = normalizer;

	if (vTextureCoord.s > textureOffset && vTextureCoord.s < (1.0 - textureOffset)){
		if (vTextureCoord.t > textureOffset && vTextureCoord.t < (1.0 - textureOffset)){

			float i = vTextureCoord.s * N;
			float j = vTextureCoord.t * N;
			float velU = (texture2D(uVel, vTextureCoord).r - normalizer) * multiplier;
			float velV = (texture2D(uVel, vTextureCoord).g - normalizer) * multiplier;
			
			float x = i - dt0 * velU;
			float y = j - dt0 * velV;
			if (x < .5) x = .5;
			if (x > N + .5) x = N + .5;
			float i0 = x;
			float i1 = i0 + 1.0;

			if (y < .5) y = .5;
			if (y > N + .5) y = N + .5;
			float j0 = y;
			float j1 = j0 + 1.0;

			float s1 = x-i0;
			float s0 = 1.0 - s1;
			float t1 = y - j0;
			float t0 = 1.0 - t1;

			float Nadj = N + 2.0;
			float topLeft = (texture2D(uD0, vec2(i0/Nadj, j0/Nadj)).r - normalizer) * multiplier;
			float bottomLeft = (texture2D(uD0, vec2(i0/Nadj, j1/Nadj)).r - normalizer) * multiplier;
			float topRight = (texture2D(uD0, vec2(i1/Nadj, j0/Nadj)).r - normalizer) * multiplier;
			float bottomRight = (texture2D(uD0, vec2(i1/Nadj, j1/Nadj)).r - normalizer) * multiplier;

			color = s0 * (t0 * topLeft + t1 * bottomLeft) + s1 * (t0 * topRight + t1 * bottomRight);
			
			color = color / multiplier;
			color += normalizer;

		}
	}

    gl_FragColor = vec4(color, color, color, 1.0);
  
}