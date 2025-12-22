// js/arcade-background.js
// Retro arcade-style particle network background using p5.js

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(1, 3);
    this.color = random([
      [76, 201, 240],   // neon-blue: #4cc9f0
      [247, 37, 133],   // neon-red: #f72585
      [74, 222, 128],   // neon-green: #4ade80
    ]);
    this.alpha = random(30, 80);
    this.pulsePhase = random(TWO_PI);
  }

  update(mouseX, mouseY) {
    // Gentle movement
    this.x += this.vx;
    this.y += this.vy;

    // Boundary wrapping with velocity preservation
    if (this.x < 0) {
      this.x = width;
    } else if (this.x > width) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = height;
    } else if (this.y > height) {
      this.y = 0;
    }

    // Subtle mouse interaction
    const mouseDist = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDist < 150) {
      const angle = atan2(this.y - mouseY, this.x - mouseX);
      const force = map(mouseDist, 0, 150, 0.5, 0);
      this.vx += cos(angle) * force * 0.1;
      this.vy += sin(angle) * force * 0.1;
    }

    // Add subtle random noise to prevent stagnation
    if (random() < 0.05) {
      this.vx += random(-0.1, 0.1);
      this.vy += random(-0.1, 0.1);
    }

    // Damping (less aggressive)
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Minimum velocity threshold to keep particles moving
    const minVel = 0.1;
    const currentSpeed = sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed < minVel && currentSpeed > 0) {
      const angle = atan2(this.vy, this.vx);
      this.vx = cos(angle) * minVel;
      this.vy = sin(angle) * minVel;
    } else if (currentSpeed === 0 || currentSpeed < 0.01) {
      // If completely stopped, give it a random direction
      const angle = random(TWO_PI);
      this.vx = cos(angle) * minVel;
      this.vy = sin(angle) * minVel;
    }

    // Pulse animation
    this.pulsePhase += 0.02;
  }

  display() {
    const pulse = sin(this.pulsePhase) * 0.3 + 0.7;
    const currentAlpha = this.alpha * pulse;
    
    fill(this.color[0], this.color[1], this.color[2], currentAlpha);
    noStroke();
    ellipse(this.x, this.y, this.size * pulse);
  }

  connect(particles, maxDist) {
    for (let other of particles) {
      if (other === this) continue;
      
      const d = dist(this.x, this.y, other.x, other.y);
      
      if (d < maxDist) {
        const opacity = map(d, 0, maxDist, 40, 0);
        const strokeColor = this.color;
        
        stroke(strokeColor[0], strokeColor[1], strokeColor[2], opacity);
        strokeWeight(0.5);
        line(this.x, this.y, other.x, other.y);
      }
    }
  }
}

let particles = [];
let connectionDistance = 120;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  
  // Create particles based on screen size
  const particleCount = floor((width * height) / 15000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(20, 20, 20, 15);
  
  // Update and display particles
  for (let particle of particles) {
    particle.update(mouseX, mouseY);
  }
  
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    particles[i].connect(particles, connectionDistance);
  }
  
  // Draw particles on top
  for (let particle of particles) {
    particle.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Adjust particle count if needed
  const currentCount = particles.length;
  const targetCount = floor((width * height) / 15000);
  
  if (targetCount > currentCount) {
    // Add particles
    for (let i = currentCount; i < targetCount; i++) {
      particles.push(new Particle());
    }
  } else if (targetCount < currentCount) {
    // Remove particles
    particles = particles.slice(0, targetCount);
  }
}

