import React from 'react';

const MetricCard = ({ title, value, icon, text }) => {
    return (
        <div className="col">
            <div className="card h-100 dashboard-metric-card">
                <div className="card-body">
                    <h6 className="card-subtitle mb-1 ms-3 mt-4 text-muted">{title}</h6>
                    <h2 className="card-title fw-bold ms-3 text-primary">{value}</h2>
                    <p className="card-text text-muted ms-3 small"><i className={`bi bi-${icon} me-1`}></i> {text}</p>
                </div>
            </div>
        </div>
    );
};

export default MetricCard;