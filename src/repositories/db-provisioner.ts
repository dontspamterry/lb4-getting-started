// TODO: For POC purposes. Methinks the provisioning should happen out-of-band from app startup
export interface DbProvisioner {
    provision(): Promise<boolean>;
}