import { Stack } from "expo-router";

import { colors } from "@/styles/colors"

export default function Layout() {

    const backgroundColor = colors.blue[400]

    return (
        <Stack 
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor },
            }} 
        />
    )
}