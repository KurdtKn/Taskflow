import { View, Image} from "react-native"
import { styles } from "./style"

export default function Index(){
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("@/assets/Logo-TaskFlow.png")} style={styles.logo} />
            </View>
        </View>
    )
  
     
}