# Preparando o ambiente

Antes de começar as lições, vamos garantir que sua máquina tem tudo que é necessário.

## Node.js

O Electron usa o Node.js por baixo, então é a primeira coisa a instalar.

Acesse [nodejs.org](https://nodejs.org) e baixe a versão LTS (Long Term Support). Qualquer versão LTS recente (20.x ou superior) funciona.

Depois de instalar, abra o terminal e verifique:

```bash
node --version
npm --version
```

## Git

O Git é necessário para navegar entre as lições (cada lição é uma branch).

**Windows:** Baixe em [git-scm.com](https://git-scm.com/download/win). As opções padrão funcionam bem.

**macOS:** Abra o terminal e digite `git --version`. Se não estiver instalado, o macOS vai oferecer pra instalar as Command Line Tools.

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git
```

## Editor de código

Recomendamos o [VS Code](https://code.visualstudio.com). Extensões úteis:

- **ESLint** — mostra erros de lint no editor
- **Prettier** — formata o código ao salvar
- **TypeScript Importer** — sugere imports automaticamente

## Verificando tudo

```bash
node --version    # v20.x.x ou superior
npm --version     # 10.x.x ou superior
git --version     # 2.x.x ou superior
```

Se todos retornaram uma versão, você está pronto. Volte ao [README.md](README.md) e comece a primeira lição.
