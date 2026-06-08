import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import CheckIcon from "../../assets/icons/check.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/terms";

type TermsTab = "terms" | "privacy" | "security";

const termsItems = [
  "O TaskFlow conecta freelancers e empresas para contratação de serviços sob demanda.",
  "As informações cadastradas devem ser verdadeiras e atualizadas.",
  "A plataforma pode intermediar a comunicação, candidatura, contratação e avaliação dos serviços.",
  "O freelancer é responsável por cumprir o serviço combinado com a empresa.",
  "A empresa é responsável por informar corretamente os detalhes do chamado, como local, data, horário e valor.",
  "Após a conclusão do serviço, ambas as partes podem realizar avaliações dentro da plataforma.",
];

const privacyItems = [
  "Os dados informados no cadastro são usados para identificação do perfil dentro da plataforma.",
  "Informações como nome, telefone, e-mail, localização e histórico de serviços podem ser utilizadas para melhorar a experiência no app.",
  "O TaskFlow não deve compartilhar dados sensíveis sem autorização do usuário.",
  "As informações são utilizadas para facilitar a conexão entre empresas e freelancers.",
  "O usuário pode solicitar atualização ou remoção de seus dados conforme as regras da plataforma.",
];

const securityItems = [
  "O chat entre empresa e freelancer só é liberado após a confirmação do fluxo do chamado.",
  "As avaliações ajudam a aumentar a confiança entre os usuários da plataforma.",
  "Denúncias, comportamentos inadequados ou informações falsas poderão gerar restrições na conta.",
  "Pagamentos, taxas e confirmações devem seguir o fluxo oficial da plataforma.",
  "A plataforma busca reduzir riscos na contratação por meio de perfis, histórico e avaliações.",
];

export default function TermsScreen() {
  const [selectedTab, setSelectedTab] = useState<TermsTab>("terms");

  function getCurrentContent() {
    if (selectedTab === "privacy") {
      return {
        title: "Política de privacidade",
        description:
          "Entenda como seus dados são utilizados dentro do TaskFlow.",
        icon: <LockIcon width={34} height={34} />,
        items: privacyItems,
      };
    }

    if (selectedTab === "security") {
      return {
        title: "Segurança na plataforma",
        description:
          "Veja as principais regras para manter uma contratação mais segura.",
        icon: <CheckIcon width={34} height={34} />,
        items: securityItems,
      };
    }

    return {
      title: "Termos de uso",
      description:
        "Confira as principais condições para utilizar o TaskFlow.",
      icon: <AssignmentIcon width={34} height={34} />,
      items: termsItems,
    };
  }

  const content = getCurrentContent();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Termos e políticas</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>TaskFlow</Text>
            <Text style={styles.heroTitle}>Uso da plataforma</Text>
            <Text style={styles.heroText}>
              Regras, privacidade e segurança para empresas e freelancers.
            </Text>
          </View>

          <View style={styles.heroIconBox}>{content.icon}</View>
        </View>

        <View style={styles.tabsArea}>
          <Pressable
            style={[
              styles.tabButton,
              selectedTab === "terms" && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab("terms")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "terms" && styles.tabTextActive,
              ]}
            >
              Termos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabButton,
              selectedTab === "privacy" && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab("privacy")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "privacy" && styles.tabTextActive,
              ]}
            >
              Privacidade
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabButton,
              selectedTab === "security" && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab("security")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "security" && styles.tabTextActive,
              ]}
            >
              Segurança
            </Text>
          </Pressable>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>{content.title}</Text>

          <Text style={styles.contentDescription}>
            {content.description}
          </Text>

          <View style={styles.itemsList}>
            {content.items.map((item, index) => (
              <View key={item} style={styles.itemRow}>
                <View style={styles.itemNumber}>
                  <Text style={styles.itemNumberText}>{index + 1}</Text>
                </View>

                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Observação</Text>

          <Text style={styles.warningText}>
            Esta tela representa uma versão resumida para o protótipo acadêmico.
            Na versão final, os textos jurídicos deverão ser revisados antes da
            publicação oficial da plataforma.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Entendi</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}