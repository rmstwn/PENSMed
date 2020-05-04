// Import method and module
const {model} = require('mongoose'),
      {
        request_check,
        localTime
      } = require('../lib'),
       schema = require('../model/hospital'),
       db = model("hospital")

// Update hospital data
exports.update_data = async (req,res) => {
    // Get 'option' and 'rs' query
    let {rs} = req.query
    // Get body request
    let {
         pasien_positif,
         pasien_pdp,
         rawat_inap_tersedia,
         rawat_inap_terpakai,
         icu_tersedia,
         icu_terpakai,
         dokter_ada,
         dokter_shift,
         perawat_ada,
         perawat_shift,
         sarung_tangan_periksa_s,
         sarung_tangan_periksa_m,
         sarung_tangan_periksa_l,
         sarung_tangan_periksa_xl,
         sarung_tangan_bedah_s,
         sarung_tangan_bedah_m,
         sarung_tangan_bedah_l,
         sarung_tangan_bedah_xl,
         pelindung_wajah_s,
         pelindung_wajah_m,
         pelindung_wajah_l,
         pelindung_wajah_xl,
         gaun_medis_s,
         gaun_medis_m,
         gaun_medis_l,
         gaun_medis_xl,
         coverall_medis_m,
         coverall_medis_l,
         coverall_medis_xl,
         coverall_medis_xxl,
         masker_bedah,
         respirator_n95,
         penutup_kepala,
         pelindung_mata,
         heavy_duty_apron,
         sepatu_boot_anti_air,
         penutup_sepatu,
         ventilator_terpakai,
         ventilator_tersedia
        } = req.body
    
    try {
        // Check if request is undefined
        await request_check(rs, 'rs')
        await request_check(pasien_positif, 'pasien_positif')
        await request_check(pasien_pdp, 'pasien_pdp')
        await request_check(rawat_inap_tersedia, 'rawat_inap_tersedia')
        await request_check(rawat_inap_terpakai, 'rawat_inap_terpakai')
        await request_check(icu_tersedia, 'icu_tersedia')
        await request_check(icu_terpakai, 'icu_terpakai')
        await request_check(dokter_ada, 'dokter_ada')
        await request_check(dokter_shift, 'dokter_shift')
        await request_check(perawat_ada, 'perawat_ada')
        await request_check(perawat_shift, 'perawat_shift')
        await request_check(sarung_tangan_periksa_s, 'sarung_tangan_periksa_s')
        await request_check(sarung_tangan_periksa_m, 'sarung_tangan_periksa_m')
        await request_check(sarung_tangan_periksa_l, 'sarung_tangan_periksa_l')
        await request_check(sarung_tangan_periksa_xl, 'sarung_tangan_periksa_xl')
        await request_check(sarung_tangan_bedah_s, 'sarung_tangan_bedah_s')
        await request_check(sarung_tangan_bedah_m, 'sarung_tangan_bedah_m')
        await request_check(sarung_tangan_bedah_l, 'sarung_tangan_bedah_l')
        await request_check(sarung_tangan_bedah_xl, 'sarung_tangan_bedah_xl')
        await request_check(pelindung_wajah_s, 'pelindung_wajah_s')
        await request_check(pelindung_wajah_m, 'pelindung_wajah_m')
        await request_check(pelindung_wajah_l, 'pelindung_wajah_l')
        await request_check(pelindung_wajah_xl, 'pelindung_wajah_xl')
        await request_check(gaun_medis_s, 'gaun_medis_s')
        await request_check(gaun_medis_m, 'gaun_medis_m')
        await request_check(gaun_medis_l, 'gaun_medis_l')
        await request_check(gaun_medis_xl, 'gaun_medis_xl')
        await request_check(coverall_medis_m, 'coverall_medis_m')
        await request_check(coverall_medis_l, 'coverall_medis_l')
        await request_check(coverall_medis_xl, 'coverall_medis_xl')
        await request_check(coverall_medis_xxl, 'coverall_medis_xxl')
        await request_check(masker_bedah, 'masker_bedah')
        await request_check(respirator_n95, 'respirator_n95')
        await request_check(penutup_kepala, 'penutup_kepala')
        await request_check(pelindung_mata, 'pelindung_mata')
        await request_check(heavy_duty_apron, 'heavy_duty_apron')
        await request_check(sepatu_boot_anti_air, 'sepatu_boot_anti_air')
        await request_check(penutup_sepatu, 'penutup_sepatu')
        await request_check(ventilator_tersedia, 'ventilator_tersedia')
        await request_check(ventilator_terpakai, 'ventilator_terpakai')
    } catch (err) {
        // Bad request
        res.status(400).send(err.toString())
        return
    }

    try {
        // Data model
        let model = {
            update_time: localTime(),
            pasien: {
                positif: pasien_positif,
                pdp: pasien_pdp
            },
            kasur: {
                rawat_inap:{
                    tersedia: rawat_inap_tersedia,
                    terpakai: rawat_inap_terpakai
                },
                icu:{
                    tersedia: icu_tersedia,
                    terpakai: icu_terpakai
                },
            },
            staf: {
                dokter: {
                    ada: dokter_ada,
                    pergantian_shift: dokter_shift
                },
                perawat: {
                    ada: perawat_ada,
                    pergantian_shift: perawat_shift
                },
            },
            apd: {
                sarung_tangan_periksa: {
                    s:sarung_tangan_periksa_s,
                    m:sarung_tangan_periksa_m,
                    l:sarung_tangan_periksa_l,
                    xl:sarung_tangan_periksa_xl,
                },
                sarung_tangan_bedah: {
                    s:sarung_tangan_bedah_s,
                    m:sarung_tangan_bedah_m,
                    l:sarung_tangan_bedah_l,
                    xl:sarung_tangan_bedah_xl,
                },
                pelindung_wajah: {
                    s:pelindung_wajah_s,
                    m:pelindung_wajah_m,
                    l:pelindung_wajah_l,
                    xl:pelindung_wajah_xl,
                },
                gaun_medis: {
                    s:gaun_medis_s,
                    m:gaun_medis_m,
                    l:gaun_medis_l,
                    xl:gaun_medis_xl,
                },
                coverall_medis: {
                    m:coverall_medis_m,
                    l:coverall_medis_l,
                    xl:coverall_medis_xl,
                    xxl:coverall_medis_xxl,
                },
                ventilator: {
                    tersedia: ventilator_tersedia,
                    terpakai: ventilator_terpakai
                },
                masker_bedah: masker_bedah,
                respirator_n95: respirator_n95,
                penutup_kepala: penutup_kepala,
                pelindung_mata: pelindung_mata,
                heavy_duty_apron: heavy_duty_apron,
                sepatu_boot_anti_air: sepatu_boot_anti_air,
                penutup_sepatu: penutup_sepatu,
            }
        }

        // Update stock
        let respond = await db.updateOne(
            {"features.properties.NAME": rs.toUpperCase()},
            {$set: {"features.$.properties.data": model}},
            {runValidators: true}
            )
        if (respond.nModified < 1) {
            res.sendStatus(400)
            return
        }

    } catch(err) {
        // Internal error
        console.error(err)
        res.sendStatus(500)
        return
    }

    res.sendStatus(200)

}