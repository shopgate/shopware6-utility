export namespace ApiteSW6Cart {
    interface PipelineConfiguration {
        endpoint: string
        accessToken: string
        languageId: string,
        showCoupon: boolean,
        cacheCoupon: boolean,
        settings: PipelineConfigSettings
    }

    interface PipelineConfigSettings {
        legalText: string
        legalInfo: string
    }
}
