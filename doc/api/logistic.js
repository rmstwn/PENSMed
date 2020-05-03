const model = require('../model/hospital')

module.exports = {
  '/api/v1/data/hospital': {
    get: {
      tags: ['Logistic Service'],
      summary: 'List of registered hospital',
      description: 'Get list of all registered hospital',
      responses: {
        '200': {
          description: 'List of hospital',
          content: {
            'application/json': {
              schema: {
                ...model
              }
            }
          }
        },
        '500': {
          description: 'Something wrong with database or server',
          content: {
            'application/json': {
              example: {
                message: 'Internal Error',
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/data/hospital/{name}': {
    parameters: [{
      name: 'name',
      in: 'path',
      description: 'Hospital Name',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    get: {
      tags: ['Logistic Service'],
      summary: 'Data of specified hospital',
      description: 'Get list hospital data',
      responses: {
        '200': {
          description: 'Hospital data',
          content: {
            'application/json': {
              schema: {
                ...model
              }
            }
          }
        },
        '500': {
          description: 'Something wrong with database or server',
          content: {
            'application/json': {
              example: {
                message: 'Internal Error',
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/add/data/hospital': {
    post: {
      tags: ['Logistic Service'],
      summary: 'Add hospital logistic data',
      description: 'Create new hospital',
      operationId: 'createHospital',
      parameters: [],
      requestBody: {
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                rumah_sakit: {
                  type: 'string'
                },
                rawat_inap: {
                  type: 'integer'
                },
                rawat_inap: {
                  type: 'integer'
                },
                icu: {
                  type: 'integer'
                },
                perawat: {
                  type: 'integer'
                },
                dokter: {
                  type: 'integer'
                },
              }
            }
          }
        },
        required: true
      },
      responses: {
        '200': {
          description: 'Created new hospital'
        },
        '500': {
          description: 'Data already exist',
          content: {
            'text/plain': {
              example: {
                message: 'Internal Server Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/update/data/hospital': {
    put: {
      tags: ['Logistic Service'],
      summary: 'Update hospital logistic data',
      description: 'Update hospital logistic data',
      operationId: 'updateHospital',
      parameters: [{
        in: 'query',
        name: 'rs',
        description: 'Hospital name',
        schema: {
          type: 'string'
        }
      }],
      requestBody: {
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              type: 'object',
              properties: {
                pasien_positif: {
                  type: 'integer'
                },
                pasien_pdp: {
                  type: 'integer'
                },
                rawat_inap_tersedia: {
                  type: 'integer'
                },
                rawat_inap_terpakai: {
                  type: 'integer'
                },
                icu_tersedia: {
                  type: 'integer'
                },
                icu_terpakai: {
                  type: 'integer'
                },
                dokter_ada: {
                  type: 'integer'
                },
                dokter_shift: {
                  type: 'integer'
                },
                perawat_ada: {
                  type: 'integer'
                },
                perawat_shift: {
                  type: 'integer'
                },
                sarung_tangan_periksa_s: {
                  type: 'integer'
                },
                sarung_tangan_periksa_m: {
                  type: 'integer'
                },
                sarung_tangan_periksa_l: {
                  type: 'integer'
                },
                sarung_tangan_periksa_xl: {
                  type: 'integer'
                },
                sarung_tangan_bedah_s: {
                  type: 'integer'
                },
                sarung_tangan_bedah_m: {
                  type: 'integer'
                },
                sarung_tangan_bedah_l: {
                  type: 'integer'
                },
                sarung_tangan_bedah_xl: {
                  type: 'integer'
                },
                pelindung_wajah_s: {
                  type: 'integer'
                },
                pelindung_wajah_m: {
                  type: 'integer'
                },
                pelindung_wajah_l: {
                  type: 'integer'
                },
                pelindung_wajah_xl: {
                  type: 'integer'
                },
                gaun_medis_s: {
                  type: 'integer'
                },
                gaun_medis_m: {
                  type: 'integer'
                },
                gaun_medis_l: {
                  type: 'integer'
                },
                gaun_medis_xl: {
                  type: 'integer'
                },
                coverall_medis_m: {
                  type: 'integer'
                },
                coverall_medis_l: {
                  type: 'integer'
                },
                coverall_medis_xl: {
                  type: 'integer'
                },
                coverall_medis_xxl: {
                  type: 'integer'
                },
                masker_bedah: {
                  type: 'integer'
                },
                respirator_n95: {
                  type: 'integer'
                },
                penutup_kepala: {
                  type: 'integer'
                },
                pelindung_mata: {
                  type: 'integer'
                },
                heavy_duty_apron: {
                  type: 'integer'
                },
                sepatu_boot_anti_air: {
                  type: 'integer'
                },
                penutup_sepatu: {
                  type: 'integer'
                },
                ventilator_terpakai: {
                  type: 'integer'
                },
                ventilator_tersedia: {
                  type: 'integer'
                },
              }
            }
          }
        },
        required: true
      },
      responses: {
        '200': {
          description: 'Updated data'
        },
        '400': {
          description: 'Invalid parameter'
        },
        '500': {
          description: 'Invalid value',
        }
      }
    }
  },
  '/api/v1/delete/data/hospital': {
    delete: {
      tags: ['Logistic Service'],
      summary: 'Delete all hospital data',
      description: 'Delete all hospital',
      operationId: 'deleteAllHospital',
      parameters: [],
      responses: {
        '200': {
          description: 'Delete data'
        },
        '204': {
          description: 'No data'
        },        
        '500': {
          description: 'Something wrong with server',
        }
      }
    }
  },
  '/api/v1/delete/data/hospital/{name}': {
    delete: {
      tags: ['Logistic Service'],
      summary: 'Delete specified hospital data',
      description: 'Delete specified hospital',
      operationId: 'deleteHospital',
      parameters: [{
        in: 'path',
        name: 'name',
        description: 'Hospital name',
        schema: {
          type: 'string'
        }
      }],
      responses: {
        '200': {
          description: 'Delete data'
        },
        '204': {
          description: 'No data'
        },
        '500': {
          description: 'Something wrong with server',
        }
      }
    }
  },
}