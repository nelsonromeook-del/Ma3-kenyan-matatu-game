/**
 * MA3 - JIRA ISSUES GENERATOR
 * Generates CSV file you can import into Jira
 */

const fs = require('fs');
const path = require('path');

const jiraIssues = [
  // EPIC 1: Visual Excellence
  {
    issueType: 'Epic',
    summary: 'Visual Excellence',
    description: 'Make MA3 the most beautiful driving game. Better graphics than Slow Roads.',
    priority: 'High',
    labels: 'graphics,polish',
    epicName: 'VISUAL-EXCELLENCE'
  },
  {
    issueType: 'Story',
    summary: 'Replace placeholder matatu with real 3D model',
    description: `Find/create realistic matatu 3D model (GLTF format)
    
Acceptance Criteria:
- [ ] Find or create realistic matatu 3D model
- [ ] Apply real paint textures
- [ ] Add LED underglow with proper glow
- [ ] Wheels rotate realistically
- [ ] Shadows work correctly`,
    storyPoints: 8,
    priority: 'High',
    labels: 'graphics,3d-model',
    epicLink: 'VISUAL-EXCELLENCE'
  },
  {
    issueType: 'Story',
    summary: 'Add post-processing effects',
    description: `Add cinema-quality visual effects
    
Acceptance Criteria:
- [ ] Bloom effect (glowing lights)
- [ ] SSAO (ambient occlusion)
- [ ] Motion blur when speeding
- [ ] Color grading (cinematic look)
- [ ] Depth of field (background blur)`,
    storyPoints: 5,
    priority: 'High',
    labels: 'graphics,post-processing',
    epicLink: 'VISUAL-EXCELLENCE'
  },
  {
    issueType: 'Story',
    summary: 'Create realistic Nairobi buildings',
    description: `Replace box buildings with detailed models
    
Acceptance Criteria:
- [ ] Replace box buildings with detailed models
- [ ] Add windows, signs, balconies
- [ ] Kenyan architectural style
- [ ] LOD system (far buildings = simple)
- [ ] Real Nairobi landmarks (KICC, Hilton, etc)`,
    storyPoints: 13,
    priority: 'Medium',
    labels: 'graphics,world-building',
    epicLink: 'VISUAL-EXCELLENCE'
  },
  {
    issueType: 'Story',
    summary: 'Procedural road system',
    description: `Create dynamic, realistic roads
    
Acceptance Criteria:
- [ ] Roads curve naturally (not just straight)
- [ ] Potholes (Nairobi authenticity!)
- [ ] Speed bumps
- [ ] Roundabouts
- [ ] Different road types (tarmac, murram)`,
    storyPoints: 8,
    priority: 'Medium',
    labels: 'graphics,world-building',
    epicLink: 'VISUAL-EXCELLENCE'
  },
  {
    issueType: 'Story',
    summary: 'Optimize to 60 FPS',
    description: `Performance optimization
    
Acceptance Criteria:
- [ ] Maintain 60 FPS on mid-range PCs
- [ ] Frustum culling (don't render off-screen)
- [ ] Object pooling for particles
- [ ] Texture compression
- [ ] Performance profiling`,
    storyPoints: 8,
    priority: 'High',
    labels: 'performance,optimization',
    epicLink: 'VISUAL-EXCELLENCE'
  },
  
  // EPIC 2: Core Gameplay
  {
    issueType: 'Epic',
    summary: 'Core Gameplay',
    description: 'Build addictive matatu simulator mechanics. Passengers, routes, economy, progression.',
    priority: 'High',
    labels: 'gameplay,mechanics',
    epicName: 'CORE-GAMEPLAY'
  },
  {
    issueType: 'Story',
    summary: 'Passenger boarding system',
    description: `Real matatu passenger mechanics
    
Acceptance Criteria:
- [ ] Passengers spawn at matatu stages
- [ ] 3D passenger models
- [ ] Board when you stop (press E)
- [ ] Pay fare (KES 50-100 depending on route)
- [ ] Get angry if you skip their stage
- [ ] Authentic Kenyan passenger behavior`,
    storyPoints: 13,
    priority: 'High',
    labels: 'gameplay,passengers',
    epicLink: 'CORE-GAMEPLAY'
  },
  {
    issueType: 'Story',
    summary: 'Route system',
    description: `Real Nairobi routes
    
Acceptance Criteria:
- [ ] Real Nairobi routes (46, 33, 23, 111, etc)
- [ ] Stage markers on map
- [ ] Route deviation penalties
- [ ] Conductor announces next stage
- [ ] Mini-missions per route`,
    storyPoints: 8,
    priority: 'High',
    labels: 'gameplay,routes',
    epicLink: 'CORE-GAMEPLAY'
  },
  {
    issueType: 'Story',
    summary: 'Economy system',
    description: `Money management
    
Acceptance Criteria:
- [ ] Earn KES from passengers
- [ ] Pay fuel costs
- [ ] Pay conductor salary
- [ ] Police bribes
- [ ] Daily expenses
- [ ] Bank account/savings`,
    storyPoints: 8,
    priority: 'Medium',
    labels: 'gameplay,economy',
    epicLink: 'CORE-GAMEPLAY'
  },
  {
    issueType: 'Story',
    summary: 'Matatu upgrades',
    description: `Customize your nganya
    
Acceptance Criteria:
- [ ] Paint jobs (KES 5,000)
- [ ] Sound systems (KES 15,000)
- [ ] Engine upgrades (KES 25,000)
- [ ] LED lights (KES 3,000)
- [ ] Better seats (comfort = more passengers)
- [ ] Graffiti/custom art`,
    storyPoints: 13,
    priority: 'Medium',
    labels: 'gameplay,upgrades',
    epicLink: 'CORE-GAMEPLAY'
  },
  
  // EPIC 3: Living World
  {
    issueType: 'Epic',
    summary: 'Living Nairobi',
    description: 'Make Nairobi feel alive. Traffic, weather, NPCs, events.',
    priority: 'Medium',
    labels: 'world,ai',
    epicName: 'LIVING-WORLD'
  },
  {
    issueType: 'Story',
    summary: 'AI Traffic system',
    description: `Realistic Nairobi traffic
    
Acceptance Criteria:
- [ ] Other matatus on road (AI-driven)
- [ ] Boda bodas weaving through traffic
- [ ] Private cars
- [ ] Pedestrians crossing randomly
- [ ] Traffic jams (realistic Nairobi!)
- [ ] Rush hour mechanics`,
    storyPoints: 13,
    priority: 'Medium',
    labels: 'world,ai,traffic',
    epicLink: 'LIVING-WORLD'
  },
  {
    issueType: 'Story',
    summary: 'Weather system',
    description: `Dynamic weather
    
Acceptance Criteria:
- [ ] Rainy season (April/November)
- [ ] Flooded roads
- [ ] Dust storms
- [ ] Sunny days
- [ ] Weather affects handling
- [ ] Rain on windshield effect`,
    storyPoints: 8,
    priority: 'Low',
    labels: 'world,weather',
    epicLink: 'LIVING-WORLD'
  },
  
  // EPIC 4: Audio
  {
    issueType: 'Epic',
    summary: 'Audio Experience',
    description: 'Authentic Kenyan matatu sound. Music, voices, city noise.',
    priority: 'Medium',
    labels: 'audio,sound',
    epicName: 'AUDIO-EXPERIENCE'
  },
  {
    issueType: 'Story',
    summary: 'Gengetone music system',
    description: `Real Kenyan music
    
Acceptance Criteria:
- [ ] 20+ Gengetone tracks
- [ ] Radio stations (Homeboyz, Kiss, etc)
- [ ] Volume control in-game
- [ ] Bass boost when upgraded sound system
- [ ] Music reacts to driving`,
    storyPoints: 5,
    priority: 'High',
    labels: 'audio,music',
    epicLink: 'AUDIO-EXPERIENCE'
  },
  {
    issueType: 'Story',
    summary: 'Engine sounds',
    description: `Realistic vehicle audio
    
Acceptance Criteria:
- [ ] Realistic engine audio
- [ ] Rev sounds change with RPM
- [ ] Turbo whistle (for upgraded matatus)
- [ ] Gear shift sounds
- [ ] Brake squeal`,
    storyPoints: 5,
    priority: 'Medium',
    labels: 'audio,sfx',
    epicLink: 'AUDIO-EXPERIENCE'
  },
  
  // EPIC 5: Launch
  {
    issueType: 'Epic',
    summary: 'Launch Ready',
    description: 'Final polish, deployment, marketing.',
    priority: 'High',
    labels: 'launch,deployment',
    epicName: 'LAUNCH'
  },
  {
    issueType: 'Story',
    summary: 'Deploy to Vercel',
    description: `Production deployment
    
Acceptance Criteria:
- [ ] Build optimized for production
- [ ] Deploy to Vercel
- [ ] Custom domain setup
- [ ] Analytics integration
- [ ] Error logging`,
    storyPoints: 3,
    priority: 'High',
    labels: 'deployment,devops',
    epicLink: 'LAUNCH'
  }
];

// Convert to CSV for Jira import
function generateCSV() {
  const headers = [
    'Issue Type',
    'Summary',
    'Description',
    'Story Points',
    'Priority',
    'Labels',
    'Epic Link',
    'Epic Name'
  ];
  
  const rows = jiraIssues.map(issue => [
    issue.issueType || '',
    issue.summary || '',
    `"${(issue.description || '').replace(/"/g, '""')}"`,
    issue.storyPoints || '',
    issue.priority || 'Medium',
    issue.labels || '',
    issue.epicLink || '',
    issue.epicName || ''
  ]);
  
  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}

// Generate Markdown documentation
function generateMarkdown() {
  let md = '# MA3 - Project Backlog\n\n';
  md += '## Overview\n\n';
  md += 'Complete project breakdown for MA3 - Kenyan Matatu Game\n\n';
  md += '---\n\n';
  
  const epics = jiraIssues.filter(i => i.issueType === 'Epic');
  
  epics.forEach(epic => {
    md += `## ${epic.summary}\n\n`;
    md += `${epic.description}\n\n`;
    
    const stories = jiraIssues.filter(i => i.epicLink === epic.epicName);
    
    if (stories.length > 0) {
      md += '### Stories:\n\n';
      stories.forEach(story => {
        md += `#### ${story.summary}\n\n`;
        md += `**Story Points:** ${story.storyPoints || 'N/A'}\n\n`;
        md += `**Priority:** ${story.priority}\n\n`;
        md += `${story.description}\n\n`;
        md += '---\n\n';
      });
    }
  });
  
  return md;
}

// Save files
const projectDir = path.join(__dirname, '..', 'project-management');
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

// Save CSV for Jira import
fs.writeFileSync(
  path.join(projectDir, 'jira-import.csv'),
  generateCSV()
);

// Save Markdown documentation
fs.writeFileSync(
  path.join(projectDir, 'BACKLOG.md'),
  generateMarkdown()
);

// Save JSON for programmatic access
fs.writeFileSync(
  path.join(projectDir, 'issues.json'),
  JSON.stringify(jiraIssues, null, 2)
);

console.log('✅ Jira issues generated!');
console.log('📁 Check the "project-management" folder');
console.log('📊 Import jira-import.csv into Jira');
console.log('📖 Read BACKLOG.md for full breakdown');