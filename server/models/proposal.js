import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bidder", // Reference to the User model

        },
        filename: {
            type: String,

        },
        prediction: {
            type: String,

        },
        explanation: {
            type: String,

        },
        features: {
            budget_variance: { type: Number, },
            construction_complexity: { type: Number, },
            contract_duration: { type: Number, },
            environmental_impact_score: { type: Number, },
            experience_years: { type: Number, },
            maintenance_history: { type: Number, },
            material_quality: { type: Number, },
            past_performance: { type: Number, },
            proposal_cost: { type: Number, },
            regional_infrastructure_quality: { type: Number, },
            regulatory_complexity: { type: Number, },
            road_length: { type: Number, },
            traffic_density: { type: Number, },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;