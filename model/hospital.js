const {Schema, model} = require('mongoose'),
      {localTime} = require('../lib')

const Hospital = new Schema({
    type: {
        type: String,
        default: 'FeatureCollection'
    },
    features: [{
        type: {
            type: String,
            default: 'Feature'
        },
        id : {
            type: Number
        },
        properties: {
            NAME: {
                type: String,
                uppercase: true,
                unique: true
            },
            email: {
                type: String,
                lowercase: true,
                unique: true
            },
            password: {
                type: String,
                minlength: 6
            },
            kode: {
                type: String,
                default: ''
            },
            CITY: {
                type: String,
                default: ''
            },
            TEL: {
                type: String,
                default: '(031)',
            },
            URL: {
                type: String,
                default: ''
            },
            session: String,
            ADDRESS1: {
                type: String,
                default: ''
            },
            ADDRESS2: {
                type: String,
                default: ''
            },
            ZIP: {
                type: Number,
                default: 0
            },
            data: {
                update_time: {
                    type: String,
                    default: localTime()
                },
                pasien: {
                    positif: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    pdp: {
                        type: Number,
                        default: 0,
                        min: 0
                    }
                },
                kasur: {
                    rawat_inap:{
                        tersedia: {
                            type: Number,
                            default: 0,
                            min: 0
                        },
                        terpakai: {
                            type: Number,
                            default: 0,
                            min: 0
                        }
                    },
                    icu:{
                        tersedia: {
                            type: Number,
                            default: 0,
                            min: 0
                        },
                        terpakai: {
                            type: Number,
                            default: 0,
                            min: 0
                        }
                    },
                },
                staf: {
                    dokter: {
                        ada: {
                            type: Number,
                            default: 0,
                            min: 0
                        },
                        pergantian_shift: {
                            type: Number,
                            default: 0,
                            min: 0
                        }
                    },
                    perawat: {
                        ada: {
                            type: Number,
                            default: 0,
                            min: 0
                        },
                        pergantian_shift: {
                            type: Number,
                            default: 0,
                            min: 0
                        }
                    },
                },
                apd: {
                    ventilator: {
                        tersedia: {
                            type: Number,
                            default: 0,
                            min: 0
                        },
                        terpakai: {
                            type: Number,
                            default: 0,
                            min: 0
                        },            
                    },
                    sarung_tangan_periksa: {
                        s:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        m:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        l:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        xl:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                    },
                    sarung_tangan_bedah: {
                        s:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        m:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        l:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        xl:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                    },
                    pelindung_wajah: {
                        s:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        m:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        l:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        xl:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                    },
                    gaun_medis: {
                        s:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        m:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        l:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        xl:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                    },
                    coverall_medis: {
                        m:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        l:{
                            type: Number,
                            default: 0,
                            min: 0
                        },
                        xl:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                        xxl:{
                            type: Number,
                            default: 0,
                            min: 0    
                        },
                    },
                    masker_bedah: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    respirator_n95: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    penutup_kepala: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    pelindung_mata: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    heavy_duty_apron: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    sepatu_boot_anti_air: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                    penutup_sepatu: {
                        type: Number,
                        default: 0,
                        min: 0
                    },
                }
            }
        },
        geometry: {
            type: {
                type: String,
                default: "Point",
                immutable: true
            },
            coordinates: {
                type: Array,
                default: [0,0]
            }
        }
    }]
},{collection: 'hospital'})

module.exports = model("hospital", Hospital)