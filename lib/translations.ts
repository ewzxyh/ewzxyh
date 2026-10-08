// Site copy in both languages. Plain data (no "use client"), so server code can read it too:
// markdown twins, llms.txt and JSON-LD are generated from this same dictionary.

export type Locale = "pt-BR" | "en-US"

export const translations = {
  "pt-BR": {
    // Navigation
    "nav.about": "Sobre",
    "nav.experience": "Experiência",
    "nav.projects": "Projetos",
    "nav.contact": "Contato",
    "nav.openToWork": "Disponível para projetos",

    // Hero
    "hero.role": "PRODUCT ENGINEER · EWZXYH LABS",
    "hero.subtitle": "Transformo ideias e operações manuais em produtos digitais prontos para operar.",
    "hero.years": "ANOS EXP.",
    "hero.projects": "PROJETOS",
    "hero.operators": "OPERADORES",
    "hero.cta": "VER PROJETOS",
    "hero.contactCta": "FALAR COMIGO",
    "hero.imageAlt": "Retrato de Enzo Yoshida, Product Engineer",
    "hero.social": "Redes e contato",

    // Services
    "services.eyebrow": "EWZXYH LABS // SERVIÇOS",
    "services.title": "Da ideia à operação",
    "services.description": "Enzo Yoshida lidera a Ewzxyh Labs para criar produtos e sistemas sob medida, unindo visão de produto, design e engenharia.",
    "services.products": "MVPs e SaaS",
    "services.products.desc": "Produtos digitais completos para validar, lançar e evoluir novas operações.",
    "services.systems": "Dashboards e integrações",
    "services.systems.desc": "Painéis e conexões entre sistemas para centralizar dados, pagamentos e decisões.",
    "services.automation": "Automação operacional",
    "services.automation.desc": "Fluxos que substituem tarefas manuais por processos rápidos, rastreáveis e escaláveis.",

    // About
    "about.section": "01 // SOBRE",
    "about.title": "Quem sou eu",
    // Names between ** are highlighted on the page and printed in bold in the markdown twins.
    "about.p1": "Sou **Enzo Hideki Yoshida**, Product Engineer e fundador da **Ewzxyh Labs**. Há mais de 5 anos transformo operações manuais em produtos digitais: entendo o processo, desenho a solução e escrevo o código, do banco de dados à interface.",
    "about.p2": "Boa parte do meu trabalho está no varejo lotérico e no WhatsApp. O **LotoHub** cria o site de uma lotérica em minutos, a **CasePay** junta PIX, CRM e aviso ao cliente, e a automação da **SELOESGO** gera as artes de mais de 630 lotéricas em segundos. Já a **Grapnel** distribui os contatos de cada campanha entre os vendedores no WhatsApp e mostra quais viraram conversa.",
    "about.p3": "Construo quase tudo com **Next.js** e cuido também do que fica por trás da interface: APIs, banco de dados, pagamentos, integrações e deploy. Desde setembro de 2026 faço pós-graduação em Cibersegurança na NBCC, no Canadá, e sigo atendendo projetos remotos.",
    "about.status": "Disponível para projetos e oportunidades",
    "about.product": "Pensamento de produto",
    "about.product.desc": "Começo pelo problema da operação e acompanho o resultado depois da entrega.",
    "about.design": "Design de interface",
    "about.design.desc": "Layout, texto e animação pensados junto com o código.",
    "about.fullstack": "Full-stack",
    "about.fullstack.desc": "Banco de dados, APIs, pagamentos, integrações e deploy.",

    // Skills
    "skills.title": "Habilidades",
    "skills.frontend": "Front-end",
    "skills.backend": "Back-end e dados",
    "skills.integrations": "Pagamentos e integrações",
    "skills.infra": "Infra e DevOps",
    "skills.ai": "IA e automação",
    "skills.nextjs.desc": "Base de quase todos os meus produtos",
    "skills.react.desc": "Interfaces com componentes reutilizáveis",
    "skills.typescript.desc": "Tipagem do banco de dados à interface",
    "skills.javascript.desc": "A linguagem da web",
    "skills.tailwind.desc": "Estilo rápido e consistente",
    "skills.gsap.desc": "Animações e efeitos de scroll",
    "skills.webgl.desc": "Shaders e efeitos na GPU",
    "skills.threejs.desc": "Cenas 3D no navegador",
    "skills.figma.desc": "Interfaces e protótipos",
    "skills.vite.desc": "Build rápido de apps e landing pages",
    "skills.expo.desc": "Apps mobile com React Native",
    "skills.nodejs.desc": "Servidores, workers e scripts",
    "skills.bun.desc": "Runtime e ferramentas rápidas",
    "skills.go.desc": "APIs, workers e coleta de dados",
    "skills.laravel.desc": "APIs e painéis em PHP",
    "skills.php.desc": "Back-end de sistemas web",
    "skills.restapi.desc": "APIs documentadas com OpenAPI",
    "skills.postgresql.desc": "Banco relacional principal",
    "skills.mysql.desc": "Banco relacional em sistemas PHP",
    "skills.supabase.desc": "Postgres, auth e storage gerenciados",
    "skills.prisma.desc": "ORM tipado para TypeScript",
    "skills.redis.desc": "Cache e filas em memória",
    "skills.pix.desc": "Cobranças com confirmação automática",
    "skills.stripe.desc": "Assinaturas e cobrança recorrente",
    "skills.whatsapp.desc": "API oficial, instâncias e automações",
    "skills.meta.desc": "Pixel e API de Conversões da Meta",
    "skills.googleads.desc": "Campanhas e rastreamento de conversões",
    "skills.vercel.desc": "Deploy de apps Next.js",
    "skills.docker.desc": "Containers para APIs e workers",
    "skills.coolify.desc": "PaaS self-hosted em VPS",
    "skills.nginx.desc": "Proxy reverso e TLS",
    "skills.cloudflare.desc": "DNS, CDN e proteção",
    "skills.linux.desc": "Servidores e VPS",
    "skills.git.desc": "Controle de versão",
    "skills.githubactions.desc": "CI/CD e automação do repositório",
    "skills.bash.desc": "Scripts e automação no terminal",
    "skills.n8n.desc": "Fluxos e integrações low-code",
    "skills.chatcase.desc": "Chatbots e automação no WhatsApp",
    "skills.openai.desc": "Modelos GPT em produtos e automações",
    "skills.claude.desc": "Programação assistida e agentes",
    "skills.gemini.desc": "Modelos do Google em automações",

    // Experience Section Headers
    "experience.work": "Experiência",
    "experience.education": "Educação",
    "experience.certificates": "Certificados",
    "experience.credential": "Ver credencial",
    "experience.status.inProgress": "Em andamento",
    "experience.status.upcoming": "Em breve",

    // Work Experience - Roles
    "experience.ewzxyh.role": "Fundador",
    "experience.ewzxyh.desc": "Meu estúdio de produto. Crio produtos próprios, como a Grapnel (distribuição de contatos e gestão de números de WhatsApp para equipes de vendas), e desenvolvo sob medida para startups, empresas e empreendedores: MVPs, SaaS, dashboards, APIs, integrações e automações. Entre os trabalhos estão o Loteria Marketplace, o site da Loteria Amazonas e a landing page da LorenzPay.",

    "experience.casepay.role": "Co-Founder & Lead Engineer",
    "experience.casepay.desc": "Cofundei a CasePay, plataforma para lotéricas que gera cobranças PIX Copia e Cola, confirma o pagamento automaticamente, avisa o cliente e registra tudo no CRM. Desenvolvi o produto de ponta a ponta, da primeira versão em Laravel à atual em Next.js: cobranças, CRM com histórico por cliente, notificações por e-mail, métricas da operação, metas por atendente, painel e site. Próximos passos: WhatsApp, SMS e integrações com LotoHub, ChatCase e DouraSoft.",

    "experience.case.role": "Lead Product Engineer",
    "experience.case.desc": "Lidero o desenvolvimento do ecossistema de produtos da Case e coordeno a equipe de desenvolvedores. Criei o CaseZap (gestão de instâncias de WhatsApp com painel, métricas, financeiro e automações) e o Case Dashboard (hub que integra as plataformas da Case e de parceiros), além do site e das ferramentas da ChatCase, das duas frentes da CaseShop (bolões on-line e loja no WhatsApp) e de dezenas de sites e landing pages para clientes. Também gerencio o Google Ads, incluindo a certificação de jogos de azar que o Google exige para anunciar loterias.",

    "experience.lotohub.role": "Fundador",
    "experience.lotohub.desc": "Fundei e desenvolvo o LotoHub, SaaS que cria o site de uma lotérica em minutos: bolões, resultados, endereço e botão de WhatsApp, com prévia antes de pagar. Os bolões entram por foto ou direto do Marketplace CAIXA, por uma API própria em Go que sincroniza catálogo, resultados e premiações. Usado pela Case e por lotéricas parceiras.",

    "experience.seloesgo.role": "Product Engineer",
    "experience.seloesgo.desc": "Fui contratado como designer e percebi que as artes das lotéricas eram montadas uma a uma. Criei um sistema integrado à API da ConectaLot que gera e distribui as artes automaticamente para mais de 630 lotéricas em Goiás: o que levava horas passou a levar segundos.",

    "experience.loteria.role": "Product Engineer",
    "experience.loteria.desc": "Sou o responsável técnico pelo e-commerce da Loteria Amazonas (Rainha do Jogo), lotérica de Goiânia desde 1989. Desenvolvi o site em Next.js com CMS próprio, a vitrine de bolões com fechamento pelo WhatsApp e a automação do atendimento, e gerencio o Google Ads com a certificação de jogos de azar.",

    "experience.lovtok.role": "Fundador",
    "experience.lovtok.desc": "E-commerce de bem-estar sexual e autocuidado. Cuido da operação de ponta a ponta: loja em WordPress, experiência de compra, design, campanhas no Google Ads e vendas.",

    // Education
    "experience.edu.nbcc": "Pós-graduação em Cibersegurança",
    "experience.edu.puc": "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    "experience.edu.colegio": "Ensino médio",
    "experience.edu.escola": "Ensino fundamental",

    // Projects
    "projects.section": "02 // TRABALHOS",
    "projects.title": "Projetos em destaque",
    "projects.description": "Produtos próprios, de sócios e de clientes: o que cada um faz e qual foi a minha parte.",
    "projects.newTab": "abre em nova aba",
    // Contact
    "contact.section": "03 // CONTATO",
    "contact.title": "O que você precisa lançar, integrar ou automatizar?",
    "contact.description": "Conte brevemente o contexto. O contato é direto com Enzo Yoshida para projetos da Ewzxyh Labs ou oportunidades profissionais.",
    "contact.cta": "FALAR SOBRE MEU PROJETO",
    "contact.alternative": "Ou me encontre no",

    // Footer
    "footer.rights": "Todos os direitos reservados.",
    "footer.built": "Construído com",
    "footer.otherLanguage": "Read in English",

    // 404
    "notFound.title": "Página não encontrada",
    "notFound.description": "Ops! A página que você está procurando não existe ou foi movida.",
    "notFound.backHome": "VOLTAR AO INÍCIO",
    "notFound.goBack": "VOLTAR",
  },
  "en-US": {
    // Navigation
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.openToWork": "Available for projects",

    // Hero
    "hero.role": "PRODUCT ENGINEER · EWZXYH LABS",
    "hero.subtitle": "I turn ideas and manual operations into digital products ready to run.",
    "hero.years": "YEARS EXP.",
    "hero.projects": "PROJECTS",
    "hero.operators": "OPERATORS",
    "hero.cta": "VIEW PROJECTS",
    "hero.contactCta": "LET'S TALK",
    "hero.imageAlt": "Portrait of Enzo Yoshida, Product Engineer",
    "hero.social": "Social links and contact",

    // Services
    "services.eyebrow": "EWZXYH LABS // SERVICES",
    "services.title": "From idea to operation",
    "services.description": "Enzo Yoshida leads Ewzxyh Labs to build custom products and systems by combining product thinking, design, and engineering.",
    "services.products": "MVPs and SaaS",
    "services.products.desc": "Complete digital products to validate, launch, and evolve new operations.",
    "services.systems": "Dashboards and integrations",
    "services.systems.desc": "Interfaces and system connections that centralize data, payments, and decisions.",
    "services.automation": "Operational automation",
    "services.automation.desc": "Workflows that replace manual tasks with fast, traceable, and scalable processes.",

    // About
    "about.section": "01 // ABOUT",
    "about.title": "About me",
    "about.p1": "I'm **Enzo Hideki Yoshida**, a Product Engineer and the founder of **Ewzxyh Labs**. For more than 5 years I have been turning manual operations into digital products: I learn the process, design the solution and write the code, from the database to the interface.",
    "about.p2": "Much of my work is in Brazilian lottery retail and on WhatsApp. **LotoHub** builds a lottery retailer's website in minutes, **CasePay** brings PIX payments, a CRM and customer notices together, and the **SELOESGO** automation generates artwork for more than 630 lottery retailers in seconds. **Grapnel** spreads each campaign's contacts across a sales team on WhatsApp and shows which ones turned into conversations.",
    "about.p3": "I build almost everything with **Next.js**, and I also own what sits behind the interface: APIs, databases, payments, integrations and deployment. Since September 2026 I have been in a postgraduate program in Cybersecurity at NBCC in Canada, and I keep taking on remote projects.",
    "about.status": "Available for projects and opportunities",
    "about.product": "Product thinking",
    "about.product.desc": "I start from the operation's problem and follow the results after launch.",
    "about.design": "Interface design",
    "about.design.desc": "Layout, copy and motion designed together with the code.",
    "about.fullstack": "Full-stack",
    "about.fullstack.desc": "Databases, APIs, payments, integrations and deployment.",

    // Skills
    "skills.title": "Skills",
    "skills.frontend": "Front-end",
    "skills.backend": "Back-end and data",
    "skills.integrations": "Payments and integrations",
    "skills.infra": "Infrastructure and DevOps",
    "skills.ai": "AI and automation",
    "skills.nextjs.desc": "The base of almost all my products",
    "skills.react.desc": "Interfaces built from reusable components",
    "skills.typescript.desc": "Types from the database to the UI",
    "skills.javascript.desc": "The language of the web",
    "skills.tailwind.desc": "Fast, consistent styling",
    "skills.gsap.desc": "Animation and scroll effects",
    "skills.webgl.desc": "Shaders and GPU effects",
    "skills.threejs.desc": "3D scenes in the browser",
    "skills.figma.desc": "Interfaces and prototypes",
    "skills.vite.desc": "Fast builds for apps and landing pages",
    "skills.expo.desc": "Mobile apps with React Native",
    "skills.nodejs.desc": "Servers, workers and scripts",
    "skills.bun.desc": "Fast runtime and tooling",
    "skills.go.desc": "APIs, workers and data collection",
    "skills.laravel.desc": "APIs and dashboards in PHP",
    "skills.php.desc": "Back end for web systems",
    "skills.restapi.desc": "APIs documented with OpenAPI",
    "skills.postgresql.desc": "Main relational database",
    "skills.mysql.desc": "Relational database for PHP systems",
    "skills.supabase.desc": "Managed Postgres, auth and storage",
    "skills.prisma.desc": "Typed ORM for TypeScript",
    "skills.redis.desc": "In-memory cache and queues",
    "skills.pix.desc": "Charges with automatic confirmation",
    "skills.stripe.desc": "Subscriptions and recurring billing",
    "skills.whatsapp.desc": "Official API, instances and automations",
    "skills.meta.desc": "Meta Pixel and Conversions API",
    "skills.googleads.desc": "Campaigns and conversion tracking",
    "skills.vercel.desc": "Deploys for Next.js apps",
    "skills.docker.desc": "Containers for APIs and workers",
    "skills.coolify.desc": "Self-hosted PaaS on a VPS",
    "skills.nginx.desc": "Reverse proxy and TLS",
    "skills.cloudflare.desc": "DNS, CDN and protection",
    "skills.linux.desc": "Servers and VPS",
    "skills.git.desc": "Version control",
    "skills.githubactions.desc": "CI/CD and repository automation",
    "skills.bash.desc": "Terminal scripts and automation",
    "skills.n8n.desc": "Low-code workflows and integrations",
    "skills.chatcase.desc": "WhatsApp chatbots and automation",
    "skills.openai.desc": "GPT models in products and automations",
    "skills.claude.desc": "Assisted coding and agents",
    "skills.gemini.desc": "Google models in automations",

    // Experience Section Headers
    "experience.work": "Work Experience",
    "experience.education": "Education",
    "experience.certificates": "Certificates",
    "experience.credential": "View credential",
    "experience.status.inProgress": "In progress",
    "experience.status.upcoming": "Upcoming",

    // Work Experience - Roles
    "experience.ewzxyh.role": "Founder",
    "experience.ewzxyh.desc": "My product studio. I build my own products, such as Grapnel (contact distribution and WhatsApp number management for sales teams), and custom work for startups, companies and founders: MVPs, SaaS products, dashboards, APIs, integrations and automations. Work includes Loteria Marketplace, the Loteria Amazonas website and the LorenzPay landing page.",

    "experience.casepay.role": "Co-Founder & Lead Engineer",
    "experience.casepay.desc": "I co-founded CasePay, a platform for lottery retailers that creates PIX charges, confirms payment automatically, notifies the customer and records everything in a CRM. I built the product end to end, from the first version in Laravel to the current one in Next.js: charges, a CRM with per-customer history, email notifications, operational metrics, per-agent goals, the dashboard and the website. Next up: WhatsApp, SMS and integrations with LotoHub, ChatCase and DouraSoft.",

    "experience.case.role": "Lead Product Engineer",
    "experience.case.desc": "I lead the development of Case's product ecosystem and coordinate the development team. I built CaseZap (WhatsApp instance management with a dashboard, analytics, billing and automations) and Case Dashboard (a hub that connects Case's and partners' platforms), plus ChatCase's website and tools, both sides of CaseShop (online lottery pools and a WhatsApp store) and dozens of websites and landing pages for clients. I also run Google Ads, including the gambling certification Google requires to advertise lotteries.",

    "experience.lotohub.role": "Founder",
    "experience.lotohub.desc": "I founded and build LotoHub, a SaaS that creates a lottery retailer's website in minutes: lottery pools, results, address and a WhatsApp button, with a preview before paying. Pools come in from a photo or straight from the CAIXA Marketplace through an in-house Go API that syncs the catalog, results and prizes. Used by Case and partner retailers.",

    "experience.seloesgo.role": "Product Engineer",
    "experience.seloesgo.desc": "I was hired as a designer and noticed that every lottery retailer's artwork was assembled by hand. I built a system on top of the ConectaLot API that generates and distributes the artwork automatically to more than 630 lottery retailers in Goiás, turning hours of work into seconds.",

    "experience.loteria.role": "Product Engineer",
    "experience.loteria.desc": "I am the technical lead for the e-commerce site of Loteria Amazonas (Rainha do Jogo), a lottery retailer in Goiânia since 1989. I built the site in Next.js with a custom CMS, the lottery pool storefront that closes sales on WhatsApp and the customer service automation, and I run Google Ads under the gambling certification.",

    "experience.lovtok.role": "Founder",
    "experience.lovtok.desc": "An e-commerce store for sexual wellness and self-care. I run it end to end: the WordPress store, the shopping experience, design, Google Ads campaigns and sales.",

    // Education
    "experience.edu.nbcc": "Postgraduate program in Cybersecurity",
    "experience.edu.puc": "Technologist degree in Systems Analysis and Development",
    "experience.edu.colegio": "High school diploma",
    "experience.edu.escola": "Elementary and middle school",

    // Projects
    "projects.section": "02 // WORK",
    "projects.title": "Featured Projects",
    "projects.description": "My own products, partner products and client work: what each one does and what my part was.",
    "projects.newTab": "opens in a new tab",
    // Contact
    "contact.section": "03 // CONTACT",
    "contact.title": "What do you need to launch, integrate, or automate?",
    "contact.description": "Share the context briefly. You will speak directly with Enzo Yoshida about Ewzxyh Labs projects or professional opportunities.",
    "contact.cta": "DISCUSS MY PROJECT",
    "contact.alternative": "Or find me on",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.built": "Built with",
    "footer.otherLanguage": "Ler em português",

    // 404
    "notFound.title": "Page not found",
    "notFound.description": "Oops! The page you're looking for doesn't exist or has been moved.",
    "notFound.backHome": "BACK TO HOME",
    "notFound.goBack": "GO BACK",
  },
} as const

export type TranslationKey = keyof typeof translations["pt-BR"]
