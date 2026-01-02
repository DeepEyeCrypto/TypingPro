import React from 'react'
import { TrendChart } from './TrendChart'
import { KeyHeatmap } from './KeyHeatmap'
import { SessionTable } from './SessionTable'
import './AnalyticsDashboard.css'

interface AnalyticsDashboardProps {
    onBack: () => void
}

export const AnalyticsDashboard = ({ onBack }: AnalyticsDashboardProps) => {
    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h1>Intelligence Hub</h1>
                <button className="back-btn" onClick={onBack}>Return to Training</button>
            </div>

            <div className="analytics-grid">
                <TrendChart />
                <KeyHeatmap />
                <SessionTable />
            </div>
        </div>
    )
}
