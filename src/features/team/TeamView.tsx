import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  UserCheck,
  UserCog,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { TeamMember, UserRole } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { generateRandomPin, validatePin, generateStrongPassword } from '../../utils/calculations.ts';

interface TeamViewProps {
  team: TeamMember[];
}

export const TeamView: React.FC<TeamViewProps> = ({ team }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);

  // Change PIN modal state
  const [pinChangeMember, setPinChangeMember] = useState<TeamMember | null>(null);
  const [newPinInput, setNewPinInput] = useState('');

  // Change Password modal state
  const [passwordChangeMember, setPasswordChangeMember] = useState<TeamMember | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Reveal PIN per member state
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  // New member form
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [memberRole, setMemberRole] = useState<UserRole>('STAFF');
  const [memberPin, setMemberPin] = useState('4321');
  const [formError, setFormError] = useState('');

  const handleOpenInvite = () => {
    setMemberName('');
    setMemberEmail('');
    setMemberPassword(generateStrongPassword(8));
    setShowMemberPassword(true);
    setMemberRole('STAFF');
    setMemberPin(generateRandomPin());
    setFormError('');
    setShowInviteModal(true);
  };

  const handleToggleRevealPin = (memberId: string) => {
    setRevealedPins((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) {
      setFormError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!validatePin(memberPin)) {
      setFormError('O PIN deve conter exatamente 4 dígitos numéricos.');
      return;
    }
    if (memberPassword.length < 6) {
      setFormError('A senha de login deve conter no mínimo 6 caracteres.');
      return;
    }

    // Check duplicate email
    const duplicate = team.find(
      (m) => m.email.trim().toLowerCase() === memberEmail.trim().toLowerCase()
    );
    if (duplicate) {
      setShowDuplicateEmailModal(true);
      return;
    }

    storageService.addTeamMember({
      restaurantId: 'rest-1',
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: memberRole,
      pin: memberPin.trim(),
      passwordHash: 'argon2id_mock_hash',
    });

    setShowInviteModal(false);
    setShowSuccessModal(true);
    soundService.playSuccessChime();
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {
      // confetti catch
    }
  };

  const handleChangeRole = (member: TeamMember, newRole: UserRole) => {
    // Protect removing last owner
    if (member.role === 'OWNER' && newRole !== 'OWNER') {
      const owners = team.filter((m) => m.role === 'OWNER');
      if (owners.length <= 1) {
        alert('Operação bloqueada: O estabelecimento deve manter pelo menos um Proprietário (OWNER) ativo.');
        return;
      }
    }
    storageService.updateTeamMember(member.id, { role: newRole });
    soundService.playSuccessChime();
  };

  const handleDeleteMember = (member: TeamMember) => {
    if (member.role === 'OWNER') {
      const owners = team.filter((m) => m.role === 'OWNER');
      if (owners.length <= 1) {
        alert('Não é possível remover o último Proprietário da equipe.');
        return;
      }
    }
    if (window.confirm(`Tem certeza que deseja remover ${member.name} da equipe?`)) {
      storageService.deleteTeamMember(member.id);
    }
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinChangeMember) return;
    if (!validatePin(newPinInput)) {
      alert('O PIN deve conter exatamente 4 dígitos numéricos.');
      return;
    }
    storageService.updateTeamMember(pinChangeMember.id, { pin: newPinInput.trim() });
    setPinChangeMember(null);
    setNewPinInput('');
    soundService.playSuccessChime();
    alert('PIN do salão atualizado com sucesso!');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordChangeMember) return;
    if (newPasswordInput.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    storageService.updateTeamMember(passwordChangeMember.id, {
      passwordHash: 'updated_argon2_hash',
    });
    setPasswordChangeMember(null);
    setNewPasswordInput('');
    soundService.playSuccessChime();
    alert('Senha de acesso redefinida com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Equipe & Permissões (RBAC)
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Cadastre garçons e gerentes, defina funções e gerencie o PIN de 4 dígitos para identificação no salão.
          </p>
        </div>

        <button
          onClick={handleOpenInvite}
          className="px-4 py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-all shadow-md shadow-[#EF003F]/20 flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Convidar Membro</span>
        </button>
      </div>

      {/* 3 Audited RBAC Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. OWNER */}
        <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EF003F] flex items-center justify-center shrink-0 border border-rose-100">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#EF003F]">
              OWNER (Proprietário)
            </h3>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Acesso total irrestrito: configurações fiscais, segurança, horários, faturamento e gestão da equipe.
          </p>
        </div>

        {/* 2. MANAGER */}
        <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <UserCog className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-amber-700">
              MANAGER (Gerente)
            </h3>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Acesso a chamados, edição do cardápio, gestão de mesas, regeneração de QR codes e relatórios.
          </p>
        </div>

        {/* 3. STAFF */}
        <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-blue-700">
              STAFF (Atendente / Garçom)
            </h3>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Acesso focado no painel operacional e no Modo TV/Celular para atender e finalizar mesas com seu PIN.
          </p>
        </div>
      </div>

      {/* Member Rows List */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs divide-y divide-[#E5E7EB]">
        {team.map((member) => {
          const isPinRevealed = revealedPins[member.id];

          return (
            <div
              key={member.id}
              className="p-4 md:px-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
            >
              {/* Member Identification */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#EF003F] border border-rose-100 font-black text-sm flex items-center justify-center shrink-0">
                  {member.name.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-[#111318]">
                      {member.name}
                    </h4>
                    {member.role === 'OWNER' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-[#EF003F]">
                        OWNER
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {member.email}
                  </span>
                </div>
              </div>

              {/* Controls: PIN Box, Trocar PIN, Trocar Senha, Role Select, Trash */}
              <div className="flex flex-wrap items-center gap-2">
                {/* PIN Box */}
                <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold flex items-center gap-2 text-gray-700">
                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                  <span>PIN Salão: {isPinRevealed ? member.pin : '••••'}</span>
                  <button
                    onClick={() => handleToggleRevealPin(member.id)}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer ml-1"
                    title={isPinRevealed ? 'Ocultar PIN' : 'Revelar PIN'}
                  >
                    {isPinRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Trocar PIN */}
                <button
                  onClick={() => {
                    setPinChangeMember(member);
                    setNewPinInput(generateRandomPin());
                  }}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 text-amber-900 bg-amber-50/50 hover:bg-amber-100 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Trocar PIN</span>
                </button>

                {/* Trocar Senha */}
                <button
                  onClick={() => {
                    setPasswordChangeMember(member);
                    setNewPasswordInput(generateStrongPassword(8));
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-900 bg-rose-50/50 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Trocar Senha</span>
                </button>

                {/* Role Dropdown */}
                <select
                  value={member.role}
                  onChange={(e) => handleChangeRole(member, e.target.value as UserRole)}
                  className="p-1.5 rounded-xl border border-gray-300 text-xs font-bold text-[#111318] bg-white cursor-pointer"
                >
                  <option value="OWNER">Owner (Proprietário)</option>
                  <option value="MANAGER">Manager (Gerente)</option>
                  <option value="STAFF">Staff (Atendente)</option>
                </select>

                {/* Trash */}
                <button
                  onClick={() => handleDeleteMember(member)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remover membro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NOVO MEMBRO DA EQUIPE */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-black text-[#111318]">
                  Novo Membro da Equipe
                </h3>
                <p className="text-xs text-[#64748B]">
                  Cadastre um funcionário, defina o e-mail, a senha de login, o papel e o PIN de 4 dígitos.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveNewMember} className="space-y-4 mt-3">
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Ex: Lucas Ferreira"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="lucas@restaurante.com.br"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#111318] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    Senha de Acesso de Login (Mín. 6 caracteres)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMemberPassword(generateStrongPassword(8));
                      setShowMemberPassword(true);
                    }}
                    className="text-[10px] font-bold text-[#EF003F] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Gerar Senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showMemberPassword ? 'text' : 'password'}
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    className="w-full p-2.5 pr-9 rounded-xl border border-gray-300 text-xs font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowMemberPassword(!showMemberPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showMemberPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  O colaborador usará este e-mail e senha para fazer login no painel do restaurante.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Função / Nível de Acesso
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                >
                  <option value="STAFF">Staff (Atendimento de Mesas)</option>
                  <option value="MANAGER">Manager (Gerente do Salão)</option>
                  <option value="OWNER">Owner (Proprietário - Acesso Total)</option>
                </select>
              </div>

              {/* PIN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#111318] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    PIN de Acesso do Salão (4 Dígitos)
                  </label>
                  <button
                    type="button"
                    onClick={() => setMemberPin(generateRandomPin())}
                    className="text-[10px] font-bold text-amber-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Gerar Aleatório
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={memberPin}
                  onChange={(e) => setMemberPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-mono tracking-widest text-center font-bold"
                  required
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  O garçom digitará este PIN no celular ou na TV para assumir atendimentos das mesas rapidamente.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Adicionar à Equipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VERMELHO ALERTA: E-MAIL DUPLICADO */}
      {showDuplicateEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#EF003F] flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#111318] mb-1">
              Atenção
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Já existe um membro cadastrado com este e-mail na sua equipe.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowDuplicateEmailModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowDuplicateEmailModal(false)}
                className="px-5 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VERDE CONFIRMAÇÃO: MEMBRO CRIADO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#111318] mb-1">
              Tudo certo!
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Membro cadastrado com sucesso! As credenciais de login e PIN já estão ativas.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Perfeito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TROCAR PIN */}
      {pinChangeMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-black text-[#111318] mb-1">
              Trocar PIN de {pinChangeMember.name}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Defina o novo PIN de 4 dígitos para identificação no salão e TV.
            </p>
            <form onSubmit={handleSaveNewPin} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 rounded-xl border border-gray-300 text-center font-mono text-lg font-black tracking-widest"
                  placeholder="0000"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPinChangeMember(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
                >
                  Salvar PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TROCAR SENHA */}
      {passwordChangeMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-black text-[#111318] mb-1">
              Trocar Senha de {passwordChangeMember.name}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Defina a nova senha de acesso ao painel do restaurante (mín. 6 caracteres).
            </p>
            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                  placeholder="Nova senha segura"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordChangeMember(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Salvar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
