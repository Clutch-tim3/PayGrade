import React from 'react';

interface SimilarRole {
  role?: string;
  title?: string;
  company: string;
  range: string;
}

interface SimilarRolesProps {
  roles: SimilarRole[];
}

const SimilarRoles: React.FC<SimilarRolesProps> = ({ roles }) => {
  return (
    <div className="similar-roles">
      <div className="similar-label">Similar roles · Cape Town</div>
      {roles.map((role, index) => (
        <div key={index} className="similar-row">
          <span className="similar-role-name">
            {role.role || role.title || 'Product Lead'}
          </span>
          <span className="similar-company">
            {role.company}
          </span>
          <span className="similar-range">
            {role.range}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SimilarRoles;
