import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";

import { useTheme } from "@/app/context/ThemeContext";

export default function TermsAndPrivacyScreen() {
  const { isDark, theme } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{
          height: 64,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text
          style={{
            color: theme.text,
            fontSize: 18,
            fontWeight: "900",
          }}
        >
          Termos e privacidade
        </Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 24,
            fontWeight: "900",
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          Termos de uso
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          Ao utilizar o TaskFlow, o usuário concorda em fornecer informações
          verdadeiras no cadastro, utilizar a plataforma de forma responsável e
          respeitar os demais usuários. A plataforma tem como objetivo conectar
          empresas e freelancers para a contratação de serviços, facilitando a
          comunicação, organização dos chamados e acompanhamento das atividades.
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          O usuário é responsável pelas informações inseridas no aplicativo,
          como dados de perfil, descrição de serviços, propostas, mensagens e
          avaliações. O uso indevido da plataforma, informações falsas,
          comportamento ofensivo ou tentativas de fraude podem resultar em
          bloqueio ou remoção da conta.
        </Text>

        <Text
          style={{
            color: theme.text,
            fontSize: 24,
            fontWeight: "900",
            marginTop: 8,
            marginBottom: 12,
          }}
        >
          Política de privacidade
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          O TaskFlow pode coletar dados como nome, e-mail, telefone, tipo de
          conta, informações de perfil, chamados publicados, candidaturas,
          mensagens e avaliações. Esses dados são utilizados para permitir o
          funcionamento da plataforma, identificar usuários, melhorar a
          experiência e garantir maior segurança nas interações.
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          Os dados dos usuários devem ser tratados com segurança e utilizados
          apenas para as finalidades relacionadas ao funcionamento do aplicativo.
          O usuário poderá solicitar atualização ou remoção de seus dados,
          conforme as regras aplicáveis de proteção de dados, incluindo a LGPD.
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 13,
            lineHeight: 20,
            marginTop: 8,
          }}
        >
          Esta tela apresenta uma versão simplificada dos termos para fins de
          protótipo acadêmico do projeto TaskFlow.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}