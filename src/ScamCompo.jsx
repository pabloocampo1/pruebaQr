import React, { useState } from 'react';
import BarcodeScanner from './BarCodeScanner';

import { Box, Button, Typography } from '@mui/material';

const ScamCompo = () => {
    const [openScanner, setOpenScanner] = useState(false);
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDetected = async (parsed) => {
        // parsed puede ser: "12345" o { code: "12345", ... } según lo que contenga el código
        const code = typeof parsed === "string" ? parsed : parsed?.code ?? parsed;

        console.log("Detected code:", code);

        // buscar en backend
        // try {
        //     setLoading(true);
        //     // ajusta la ruta a tu endpoint real
        //     const res = await api.get(`/equipment/get-by-code/${encodeURIComponent(code)}`);
        //     if (res.status === 200) {
        //         setEquipment(res.data);
        //     } else {
        //         setEquipment(null);
        //     }
        // } catch (err) {
        //     console.error("fetch error", err);
        // } finally {
        //     setLoading(false);
        //     // cerrar modal ya lo hace el componente, pero por seguridad:
        //     setOpenScanner(false);
        // }
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => setOpenScanner(true)}>
                Scan Equipment
            </Button>

            <BarcodeScanner
                open={openScanner}
                onDetected={handleDetected}
                onClose={() => setOpenScanner(false)}
            />

            <Box mt={3}>
                {loading && <Typography>Searching...</Typography>}
                {equipment ? (
                    <Box p={2} sx={{ border: "1px solid #ddd", borderRadius: 1 }}>
                        <Typography variant="h6">{equipment.equipmentName ?? equipment.name ?? "Equipment"}</Typography>
                        <Typography>Code: {equipment.internalCode ?? equipment.code}</Typography>
                        <Typography>Serial: {equipment.serialNumber}</Typography>
                    </Box>
                ) : (
                    !loading && <Typography>No equipment selected</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ScamCompo;