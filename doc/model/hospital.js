let time = new Date()
module.exports = {
    Hospital: {
        type: 'object',
        properties: {
            rumah_sakit: {
                type: 'string',
                description: 'Hospital name',
                example: 'RS Dr. Suwandi'
            },
            data: {
                type: 'array',
                items: {
                    type:'object',
                    properties: {
                    update_time: {
                        type: 'string',
                        example: time.toString(),
                        default: time.toString()
                    },
                    pasien: {
                        type: 'object',
                        properties: {
                            positif: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            pdp: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            }
                        },
                    },
                    kasur: {
                        type: 'object',
                        properties: {
                            rawat_inap:{
                                type: 'object',
                                properties: {
                                    tersedia: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },
                                    terpakai: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    }
                                }
                            },
                            icu:{
                                type: 'object',
                                properties: {
                                    tersedia: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },
                                    terpakai: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    }
                                }
                            },
                        }
                    },
                    staf: {
                        type: 'object',
                        properties: {                         
                            dokter: {
                                type: 'object',
                                properties: {
                                    ada: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },
                                    pergantian_shift: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    }
                                }
                            },
                            perawat: {
                                type: 'object',
                                properties: {
                                    ada: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },
                                    pergantian_shift: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    }
                                }
                            },
                        }
                    },
                    apd: {
                        type: 'object',
                        properties: {
                            ventilator: {
                                type: 'object',
                                properties: {
                                    tersedia: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },
                                    terpakai: {
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },     
                                },
                            },
                            sarung_tangan_periksa: {
                                type: 'object',
                                properties: {
                                    s:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    m:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    l:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    xl:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                }
                            },
                            sarung_tangan_bedah: {
                                type: 'object',
                                properties: {
                                    s:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    m:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    l:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    xl:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                }
                            },
                            pelindung_wajah: {
                                type: 'object',
                                properties: {
                                    s:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    m:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    l:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    xl:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                }
                            },
                            gaun_medis: {
                                type: 'object',
                                properties: {
                                    s:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    m:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    l:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    xl:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                }
                            },
                            coverall_medis: {
                                type: 'object',
                                properties: {
                                    m:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    l:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20),
                                        default: 0
                                    },
                                    xl:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                    xxl:{
                                        type: 'integer',
                                        example: Math.floor(Math.random() * 20)    ,
                                        default: 0
                                    },
                                }
                            },
                            masker_bedah: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            respirator_n95: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            penutup_kepala: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            pelindung_mata: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            heavy_duty_apron: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            sepatu_boot_anti_air: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                            penutup_sepatu: {
                                type: 'integer',
                                example: Math.floor(Math.random() * 20),
                                default: 0
                            },
                        }
                    }
                }
                },
                
            }

        },
    }
}