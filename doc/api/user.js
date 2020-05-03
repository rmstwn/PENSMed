const model = require('../model/user')

module.exports = {
	'/register?category=donor': {
			post: {
				tags: ['User Service'],
				summary: 'Register as donor',
				description: 'Register as donor',
				operationId: 'registerDonor',
				requestBody: {
					content: {
						'application/x-www-form-urlencoded': {
								schema: {
										type: 'object',
										properties: {
												name: {
														type: 'string',
												},
												email: {
														type: 'string'
												},
												password: {
														type: 'string'
												},
												confirm_password: {
														type: 'string'
												},
												perusahaan: {
														type: 'string'
												},
										}
								}
						}
				},
				required: true
			},
			responses : {
				'200': {
					description: 'Register success'
				},
				'400': {
					description: 'Invalid value'
				},
				'500': {
					description: 'Data already exist'
				}
			},
		}
	},
	'/register?category=hospital': {
			post: {
				tags: ['User Service'],
				summary: 'Register as hospital',
				description: 'Register as hospital',
				operationId: 'registerDonor',
				requestBody: {
					content: {
						'application/x-www-form-urlencoded': {
								schema: {
										type: 'object',
										properties: {
												name: {
														type: 'string',
												},
												email: {
														type: 'string'
												},
												password: {
														type: 'string'
												},
												confirm_password: {
														type: 'string'
												},
												kode: {
														type: 'string'
												},
										}
								}
						}
				},
				required: true
			},
			responses : {
				'200': {
					description: 'Register success'
				},
				'400': {
					description: 'Invalid value'
				},
				'500': {
					description: 'Data already exist'
				}
			},
		}
	},	
	'/login': {
		post: {
			tags: ['User Service'],
			summary: 'Authenticate user',
			description: 'Authenticate user',
			operationId: 'loginUser',
			requestBody: {
				content: {
					'application/x-www-form-urlencoded': {
						schema: {
							type: 'object',
							properties: {
								email: {
									type: 'string'
								},
								password: {
									type: 'string'
								}
							}
						}
					}
				},
				required: true
			},
			responses: {
				'200': {
					description: 'Login success'
				},
				'400': {
					description: 'Invalid value'
				},
				'401': {
					description: 'Wrong email or password'
				},
				'500': {
					description: 'Internal server error'
				}
			}
		},
	},
	'api/v1/data/user': {
		get: {
			tags: ['User Service'],
			summary: 'Get all user data',
			description: 'Get all user data',
			operationId: 'getUserData',
			parameters: [{
				in: 'query',
				name: 'list',
				description: '"all" or "donor" or "hospital"',
				schema: {
					type: 'string'
				}
			}],
			responses: {
				'200': {
					description: 'Get list user'
				},
				'500' : {
					description: 'Something wrong with database'
				}
			}
		}
	},
	'api/v1/update/data/user?category=donor': {
		put: {
			tags: ['User Service'],
			summary: 'Update donor data',
			description: 'Update donor data',
			operationId: 'loginUser',
			requestBody: {
				content: {
					'application/x-www-form-urlencoded': {
						schema: {
							type: 'object',
							properties: {
								name: {
									type: 'string'
								},
								perusahaan: {
									type: 'string'
								},
							}
						}
					}
				},
				required: true
			},
			responses: {
				'200': {
					description: 'Update success'
				},
				'400': {
					description: 'Invalid Value'
				},
				'500': {
					description: 'Something wrong with server'
				}
			}
		}
	},	
	'api/v1/update/data/user?category=hospital': {
		put: {
			tags: ['User Service'],
			summary: 'Update hospital data',
			description: 'Update hospital data',
			operationId: 'loginUser',
			requestBody: {
				content: {
					'application/x-www-form-urlencoded': {
						schema: {
							type: 'object',
							properties: {
								hospital: {
									type: 'string'
								},
								contact: {
									type: 'string'
								},
								address: {
									type: 'string'
								},
								coord1: {
									type: 'string'
								},
								coord2: {
									type: 'string'
								},
								city: {
									type: 'string'
								},
								kode: {
									type: 'string'
								},
								url: {
									type: 'string'
								},
								zip: {
									type: 'integer'
								}
							}
						}
					}
				},
				required: true
			},
			responses: {
				'200': {
					description: 'Update success'
				},
				'400': {
					description: 'Invalid Value'
				},
				'500': {
					description: 'Something wrong with server'
				}
			}
		}
	},
	'api/v1/map/hospital': {
		get: {
			tags: ['User Service'],
			summary: 'Update hospital data',
			description: 'Update hospital data',
			operationId: 'getMaps',
			responses: {
				'200': {
					description: 'Update success'
				},
				'400': {
					description: 'Invalid Value'
				},
				'500': {
					description: 'Something wrong with server'
				}
			}
		}
	}	
}