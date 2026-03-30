import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface SkillsProps {
  skills: SalaryIntelligence['skill_adjustments'];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  const getSkillIcon = (skill: string): string => {
    const icons: { [key: string]: string } = {
      'React': '⚛️',
      'Node.js': '🚀',
      'Python': '🐍',
      'AWS': '☁️',
      'Docker': '🐳',
      'Kubernetes': '☸️',
      'Data Science': '📊',
      'Leadership': '👥',
    };
    return icons[skill] || '💻';
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner':
        return '#6366f1';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#d97706';
      case 'expert':
        return '#dc2626';
      default:
        return '#6366f1';
    }
  };

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <span className="skills-title">🎯 Skill-Based Adjustments</span>
        <span className="skills-subtitle">Additional compensation by skill</span>
      </div>
      <div className="skills-content">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <div className="skill-info">
              <span className="skill-icon">{getSkillIcon(skill.skill)}</span>
              <span className="skill-name">{skill.skill}</span>
              <span 
                className="skill-level" 
                style={{ 
                  backgroundColor: getLevelColor(skill.level),
                  color: '#ffffff'
                }}
              >
                {skill.level}
              </span>
            </div>
            <div className="skill-adjustment">
              +{skill.adjustment}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
