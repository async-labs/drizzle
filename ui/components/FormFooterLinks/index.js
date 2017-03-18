import React, { PropTypes } from 'react';
import './style.scss';

export const removeNullableLinks = (links) => links.filter(link => !!link);

const FormFooterLinks = ({ links }) => {
  const validLinks = removeNullableLinks(links);

  return (
    <div className="drizzle-form-footer-links">
      {validLinks.map(({ label, className, ...props }, index) => (
        <span key={`${index}`}>
          <a
            className={className}
            {...props}
          >
            {label}
          </a>
          {/* If is not the last link, add ' | ' to separate links' */}
          {index !== validLinks.length - 1 && (
            <span>&nbsp; | &nbsp;</span>
          )}
        </span>
      ))}
    </div>
  );
};

FormFooterLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    /**
     * The text to display on the link
     */
    label: PropTypes.string.isRequired,
    /**
     * The route or url of the link
     */
    href: PropTypes.string.isRequired,
    /**
     * Optional custom className
     */
    className: PropTypes.string,
  })),
};

export default FormFooterLinks;
