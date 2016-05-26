precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D gridTexture;

void main() {
  vec4 color = texture2D(gridTexture, vTextureCoord);
  float r=color.b;
  if (r<1.0) r=1.0; // prevent infinities
  float theta=atan(color.g,color.r); // get the direction of the velocity for the hue
  float s=sqrt(color.g*color.g+color.r*color.r)/(10.0*r); // saturation is based on magnitude of the velocity
  if (s>1.0) s=1.0;
  r=sqrt(r*0.04); // value will be based on total density, but lets give it a broad plateau so it doesn't wash out

// The following expression roughly converts the values to hue/saturation/value space
  float rCol = r*(s*cos(theta)+0.5*(1.0-s));
  // float rCol = .7;
  // float g = r*(s*cos(theta+0.2*3.1415/3.0)+0.5*(1.0-s));
  float gCol = .1;
  float bCol = r*(s*cos(theta+1.0*3.1415/3.0)+0.5*(1.0-s));
  // gl_FragColor = vec4(r*(s*cos(theta)+0.5*(1.0-s)), r*(s*cos(theta+0.2*3.1415/3.0)+0.5*(1.0-s)), r*(s*cos(theta+4.0*3.1415/3.0)+0.5*(1.0-s)), 1.0);
  gl_FragColor = vec4(rCol,gCol,bCol,1.0);
}