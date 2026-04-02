import React from 'react'
import '../styles/ErrorPage.css'

export default function ErrorPage({ message }) {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-logo">LSC</div>
        <h1>Project Not Found</h1>
        <p className="error-message">{message || 'This project link is invalid or expired.'}</p>
        <p className="error-subtext">Please contact LSC Fitouts for assistance.</p>
        <a href={`${import.meta.env.BASE_URL}`} className="error-home-link">
          Back to Projects
        </a>
      </div>
    </div>
  )
}
