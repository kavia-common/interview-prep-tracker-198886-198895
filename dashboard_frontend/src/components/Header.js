import React from "react";

/**
 * Dashboard header with brand title/tagline and an optional primary action.
 */
export default function Header({
  title,
  tagline,
  primaryActionLabel,
  onPrimaryAction,
}) {
  return (
    <header className="TopBar">
      <div className="TopBar__inner">
        <div className="Brand">
          <div className="Brand__mark" aria-hidden="true" />
          <div className="Brand__text">
            <div className="Brand__name">{title}</div>
            {tagline ? <div className="Brand__tagline">{tagline}</div> : null}
          </div>
        </div>

        <div className="TopBar__actions" aria-label="Header actions">
          {primaryActionLabel ? (
            <button
              className="Button Button--primary"
              type="button"
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
