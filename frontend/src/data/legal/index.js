import { TermsOfServiceContent } from './TermsOfService';
import { PrivacyPolicyContent } from './PrivacyPolicy';
import { HardwareAgreementContent } from './HardwareAgreement';
import { RefundPolicyContent } from './RefundPolicy';
import { PartnershipAgreementContent } from './PartnershipAgreement';
import { TokenSaleAgreementContent } from './TokenSaleAgreement';

export const LEGAL_DOCS = {
    tos: {
        title: 'Terms of Service',
        content: TermsOfServiceContent,
        lastUpdated: 'March 13, 2026'
    },
    privacy: {
        title: 'Privacy Policy',
        content: PrivacyPolicyContent,
        lastUpdated: 'March 13, 2026'
    },
    hardware: {
        title: 'Hardware Purchase Agreement',
        content: HardwareAgreementContent,
        lastUpdated: 'March 13, 2026'
    },
    refund: {
        title: 'Refund Policy',
        content: RefundPolicyContent,
        lastUpdated: 'March 13, 2026'
    },
    partnership: {
        title: 'Partnership Agreement',
        content: PartnershipAgreementContent,
        lastUpdated: 'March 13, 2026'
    },
    token: {
        title: 'Token Sale Agreement (SAFT)',
        content: TokenSaleAgreementContent,
        lastUpdated: 'March 13, 2026'
    }
};
