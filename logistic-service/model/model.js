// Import method
const {Schema,model} = require('mongoose'),
      {localTime} = require('../lib')

// Creating DB model
const hospital_data = new Schema({
    rumah_sakit: {
        type: String,
        uppercase: true,
        unique: true
    },
    data: [{
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
    }]
},{collection: 'logistic'})

// Export model
module.exports = model("hospital_data",hospital_data)