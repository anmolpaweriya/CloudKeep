export default function detectDeviceType(userAgent: string) {
    // Convert the userAgent to lowercase for case-insensitive matching
    userAgent = userAgent.toLowerCase();

    // Regular expressions to match common device types and names
    const mobileRegex = /mobile|android|iphone|ipod|opera mini|blackberry|windows (phone|ce)|iemobile|smartphone|avantgo|android|fennec|kindle|palm|silk|webos|mobile safari|mobi/i;
    const tabletRegex = /tablet|ipad|playbook|silk|kindle|android|nexus|bb10|rim tablet os/i;

    // OS types mapping for better identification
    const osTypes: {
        [key: string]: string
    } = {
        'windows': 'Windows',
        'mac os': 'macOS',
        'linux': 'Linux',
        'ios': 'iOS',
        'android': 'Android'
        // Add more as needed
    };

    // Check if the userAgent matches mobile or tablet patterns
    for (let os in osTypes) {
        if (userAgent.includes(os)) {
            return osTypes[os];
        }
    }

    // If no specific OS type matched, check if it's a tablet or mobile
    if (tabletRegex.test(userAgent)) {
        return 'Tablet';
    } else if (mobileRegex.test(userAgent)) {
        return 'Mobile';
    } else {
        return 'Desktop';
    }
}
