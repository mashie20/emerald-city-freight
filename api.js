// ====================================
// API SIMULATION & BACKEND INTEGRATION
// Realistic API calls with mock data
// ====================================

// API Configuration
const API_CONFIG = {
    baseURL: 'https://api.emeraldcityfreight.com/v1',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'API-Key': 'demo-key-12345'
    }
};

// Mock API Database
const MOCK_DATABASE = {
    shipments: {
        'ECF123456789': {
            id: 'ECF123456789',
            status: 'In Transit',
            origin: 'Seattle, WA',
            destination: 'Portland, OR',
            currentLocation: { lat: 47.6062, lng: -122.3321, city: 'Seattle, WA' },
            eta: '2 days',
            weight: 500,
            service: 'Ground Freight',
            timeline: [
                { date: '2024-12-01 09:00', status: 'Picked Up', location: 'Seattle, WA' },
                { date: '2024-12-01 14:30', status: 'In Transit', location: 'Seattle Distribution Center' },
                { date: '2024-12-02 08:00', status: 'In Transit', location: 'Tacoma Hub' }
            ]
        },
        'ECF987654321': {
            id: 'ECF987654321',
            status: 'Out for Delivery',
            origin: 'Los Angeles, CA',
            destination: 'San Francisco, CA',
            currentLocation: { lat: 37.7749, lng: -122.4194, city: 'San Francisco, CA' },
            eta: 'Today by 5 PM',
            weight: 250,
            service: 'Expedited',
            timeline: [
                { date: '2024-12-02 06:00', status: 'Picked Up', location: 'Los Angeles, CA' },
                { date: '2024-12-02 12:00', status: 'In Transit', location: 'Bakersfield Hub' },
                { date: '2024-12-03 07:00', status: 'Out for Delivery', location: 'San Francisco, CA' }
            ]
        }
    },
    users: {
        'demo@emeraldcity.com': {
            id: 'user_001',
            email: 'demo@emeraldcity.com',
            name: 'Demo User',
            company: 'Demo Company Inc',
            shipments: ['ECF123456789', 'ECF987654321'],
            savedAddresses: [
                { id: 'addr_1', label: 'Warehouse', address: '123 Freight Ave, Seattle, WA 98101' },
                { id: 'addr_2', label: 'Office', address: '456 Business St, Portland, OR 97201' }
            ]
        }
    },
    quotes: []
};

// API Service Class
class FreightAPI {
    constructor() {
        this.isOnline = navigator.onLine;
        this.setupConnectionMonitoring();
    }

    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            showNotification('Working offline - using cached data', 'info');
        });
    }

    async simulateAPICall(endpoint, data, delay = 800) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.95) { // 5% chance of error for realism
                    reject(new Error('Network error - please try again'));
                } else {
                    resolve({ success: true, data });
                }
            }, delay);
        });
    }

    async trackShipment(trackingNumber) {
        try {
            // Check if tracking number exists in mock database
            const shipment = MOCK_DATABASE.shipments[trackingNumber];

            if (shipment) {
                await this.simulateAPICall('/track', shipment);
                return shipment;
            } else {
                // Generate random tracking data for any tracking number
                const randomStatuses = [
                    { status: 'In Transit', location: { lat: 47.6062, lng: -122.3321, city: 'Seattle, WA' }, eta: '2 days' },
                    { status: 'Out for Delivery', location: { lat: 45.5152, lng: -122.6784, city: 'Portland, OR' }, eta: 'Today by 5 PM' },
                    { status: 'Delivered', location: { lat: 49.2827, lng: -123.1207, city: 'Vancouver, BC' }, eta: 'Delivered on Dec 1' },
                    { status: 'At Distribution Center', location: { lat: 47.4502, lng: -122.3088, city: 'Tacoma, WA' }, eta: '1 day' }
                ];

                const randomData = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];

                await this.simulateAPICall('/track', randomData);

                return {
                    id: trackingNumber,
                    status: randomData.status,
                    currentLocation: randomData.location,
                    eta: randomData.eta,
                    origin: 'Origin Location',
                    destination: 'Destination Location',
                    timeline: [
                        { date: new Date().toISOString(), status: randomData.status, location: randomData.location.city }
                    ]
                };
            }
        } catch (error) {
            throw new Error('Failed to fetch tracking information');
        }
    }

    async calculateQuote(quoteData) {
        try {
            const { origin, destination, weight, service, cargo } = quoteData;

            // Enhanced pricing algorithm
            const baseRates = {
                'ground': 0.50,
                'air': 2.00,
                'ocean': 0.30,
                'expedited': 3.50
            };

            const cargoMultipliers = {
                'general': 1.0,
                'fragile': 1.3,
                'perishable': 1.5,
                'hazardous': 2.0
            };

            const deliveryTimes = {
                'ground': '3-5 business days',
                'air': '1-2 business days',
                'ocean': '2-4 weeks',
                'expedited': '24 hours'
            };

            // Simulate distance calculation
            const distanceMultiplier = 1.0 + (Math.random() * 0.5);

            // Calculate base price
            const baseRate = baseRates[service] || 0.50;
            const cargoMultiplier = cargoMultipliers[cargo] || 1.0;
            const total = (weight * baseRate * cargoMultiplier * distanceMultiplier).toFixed(2);

            const quote = {
                quoteId: 'QT' + Date.now(),
                amount: total,
                deliveryTime: deliveryTimes[service],
                origin,
                destination,
                weight,
                service,
                cargo,
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                breakdown: {
                    baseRate: (weight * baseRate).toFixed(2),
                    cargoFee: ((weight * baseRate * (cargoMultiplier - 1))).toFixed(2),
                    distanceFee: ((weight * baseRate * cargoMultiplier * (distanceMultiplier - 1))).toFixed(2)
                }
            };

            await this.simulateAPICall('/quote', quote);

            // Save quote to mock database
            MOCK_DATABASE.quotes.push(quote);

            return quote;
        } catch (error) {
            throw new Error('Failed to calculate quote');
        }
    }

    async submitContactForm(formData) {
        try {
            await this.simulateAPICall('/contact', formData);

            return {
                success: true,
                message: 'Thank you for contacting us! We will respond within 24 hours.',
                ticketId: 'TICKET-' + Date.now()
            };
        } catch (error) {
            throw new Error('Failed to submit contact form');
        }
    }

    async authenticateUser(email, password) {
        try {
            await this.simulateAPICall('/auth/login', { email });

            const user = MOCK_DATABASE.users[email];

            if (user) {
                return {
                    success: true,
                    user,
                    token: 'jwt_token_' + Date.now()
                };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            throw new Error('Authentication failed');
        }
    }

    async getUserShipments(userId) {
        try {
            const user = Object.values(MOCK_DATABASE.users).find(u => u.id === userId);

            if (user) {
                const shipments = user.shipments.map(id => MOCK_DATABASE.shipments[id]).filter(Boolean);
                await this.simulateAPICall('/user/shipments', shipments);
                return shipments;
            }

            return [];
        } catch (error) {
            throw new Error('Failed to fetch user shipments');
        }
    }
}

// Initialize API service
const freightAPI = new FreightAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FreightAPI, freightAPI, MOCK_DATABASE };
}
