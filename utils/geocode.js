const getCoordinates = async (location) => {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;

    console.log("Geoapify URL:", url);

    const response = await fetch(url);

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (!response.ok) {
        throw new Error(`Geoapify Error: ${response.status}`);
    }

    if (!data.features || data.features.length === 0) {
        throw new Error("Location not found");
    }

    return {
        type: "Point",
        coordinates: data.features[0].geometry.coordinates,
    };
};

module.exports = getCoordinates;