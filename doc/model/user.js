module.exports = {
    Donor: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: "Donor's name",
                example: 'John Doe'
            },
            email: {
                type: 'string',
                description: "Donor's email",
                example: 'johndoe@mail.com'
            },
            password: {
                type: 'string',
                description: "Must contain at least 1 uppercase, 1 number, and minimum 6 characters length",
                example: 'Johnd0e'
            },
            session: {
                type: 'string',
                description: "Token session",
                example: "rh392rh9eihr23d102sda93s1d248aff4csa34jt"
            },
            confirm: {
                type: 'string',
                description: "Whether donor's email has confirmed or not",
                example: "true"
            },
            perusahaan: {
                type: 'string',
                description: "Donor's company (optional)",
                example: "PT. Donor"
            }
        }
    },
    Hospital_Data: {
        type: 'object',
        properties: {
            hospital: {
                type: 'string',
                description: 'Hospital name',
                example: 'RSUD Dr. Soetomo'
            },
            email: {
                type: 'string',
                description: "Hospital's email",
                example: "rsudsoetomo@mail.com"
            },
            password: {
                type: 'string',
                description: "Must contain at least 1 uppercase, 1 number and minimum 6 characters length",
                example: "RsudS0etomo"
            },
            kode: {
                type: 'string',
                description: "Hospital identifier code",
            },
            city: {
                type: 'string',
                description: "A city where hospital placed",
                example: "Surabaya"
            },
            contact: {
                type: 'string',
                description: "Hospital's contact",
                example: "(031) 888555"
            },
            url : {
                type: 'string',
                description: "Hospital official website",
                example: "www.rsudsoetomo.com"
            },
            session: {
                type: 'string',
                description: "Token session",
                example: "djw01830rj3802ur02njwnr2k3j12S2i3os"
            },
            confirm: {
                type: 'string',
                description: "Whether hospital's email has confirmed",
                example: "true"
            },
            localtion: {
                type: 'object',
                properties: {
                    address: {
                        type: 'string',
                        description: "Hospital's address",
                        example: "Jl. Mayjen Prof. Dr. Moestopo No.6-8, Airlangga, Kec. Gubeng"
                    },
                    zip: {
                        type: 'integer',
                        description: "Hospital's post code",
                        example: 60286
                    },
                    coordinates: {
                        type: 'array',
                        description: "Hospital coordinates on map",
                        example: [-7.2680537,112.7584762]
                    }
                }
            }
        }
    }
}
