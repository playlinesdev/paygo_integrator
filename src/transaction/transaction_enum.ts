export enum TransactionStatus {
    initiated, awaiting_for_payment, in_analysis, expired, authorized, confirmed, denied, canceling_in_progress, canceled, pending_confirmation, failed_supplier_communication, integration_canceled
}

export enum EnterativeCommunicationStatus {
    idle, waiting
}