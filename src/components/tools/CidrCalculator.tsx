'use client';

import React, { useState } from 'react';
import { Network, Calculator, Layers, Info } from 'lucide-react';

export function CidrCalculator() {
  const [ipInput, setIpInput] = useState('10.0.0.0');
  const [prefix, setPrefix] = useState<number>(16);

  // Helper calculation functions
  const calculateCidr = () => {
    try {
      const parts = ipInput.trim().split('.').map(Number);
      if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
        return null;
      }

      const totalIps = Math.pow(2, 32 - prefix);
      const hostBits = 32 - prefix;

      // Netmask
      const maskBinary = '1'.repeat(prefix) + '0'.repeat(hostBits);
      const maskOctets = [];
      for (let i = 0; i < 32; i += 8) {
        maskOctets.push(parseInt(maskBinary.slice(i, i + 8), 2));
      }
      const netmask = maskOctets.join('.');

      // Numeric IP
      const ipNum =
        ((parts[0] << 24) >>> 0) +
        ((parts[1] << 16) >>> 0) +
        ((parts[2] << 8) >>> 0) +
        (parts[3] >>> 0);

      const maskNum =
        ((maskOctets[0] << 24) >>> 0) +
        ((maskOctets[1] << 16) >>> 0) +
        ((maskOctets[2] << 8) >>> 0) +
        (maskOctets[3] >>> 0);

      const networkNum = (ipNum & maskNum) >>> 0;
      const broadcastNum = (networkNum + totalIps - 1) >>> 0;

      const numToIp = (num: number) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ].join('.');

      const networkIp = numToIp(networkNum);
      const broadcastIp = numToIp(broadcastNum);
      const firstUsable = prefix >= 31 ? networkIp : numToIp(networkNum + 1);
      const lastUsable = prefix >= 31 ? broadcastIp : numToIp(broadcastNum - 1);
      const cloudUsable = Math.max(0, totalIps - 5);

      return {
        cidr: `${networkIp}/${prefix}`,
        netmask,
        networkIp,
        broadcastIp,
        firstUsable,
        lastUsable,
        totalIps,
        cloudUsable,
        ipBinary: parts.map((p) => p.toString(2).padStart(8, '0')).join('.'),
      };
    } catch (e) {
      return null;
    }
  };

  const info = calculateCidr();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Visual Cloud CIDR & Subnet Calculator</h2>
          <p className="text-xs text-slate-400">
            Compute network bounds, host capacity, and hyperscaler 5-IP reserved allocations
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-2">
            Base IP Address
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="10.0.0.0"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
          <div className="mt-2 flex gap-2">
            {['10.0.0.0', '172.16.0.0', '192.168.1.0'].map((preset) => (
              <button
                key={preset}
                onClick={() => setIpInput(preset)}
                className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Subnet Mask Prefix (/{prefix})
            </label>
            <span className="font-mono text-xs text-purple-400 font-bold">
              {info ? info.totalIps.toLocaleString() : 0} Total IPs
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={30}
            value={prefix}
            onChange={(e) => setPrefix(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>/8 (16M IPs)</span>
            <span>/16 (VPC standard)</span>
            <span>/24 (Subnet)</span>
            <span>/30 (4 IPs)</span>
          </div>
        </div>
      </div>

      {/* Output Results Cards */}
      {info && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500">Calculated CIDR</span>
              <p className="text-base font-mono font-bold text-purple-400 mt-1">{info.cidr}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500">Subnet Netmask</span>
              <p className="text-base font-mono font-bold text-slate-200 mt-1">{info.netmask}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500">Total Addresses</span>
              <p className="text-base font-mono font-bold text-emerald-400 mt-1">
                {info.totalIps.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500">Cloud Usable IPs</span>
              <p className="text-base font-mono font-bold text-sky-400 mt-1">
                {info.cloudUsable.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">Network Address:</span>
              <span className="text-slate-200">{info.networkIp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">First Usable Host:</span>
              <span className="text-emerald-300">{info.firstUsable}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">Last Usable Host:</span>
              <span className="text-emerald-300">{info.lastUsable}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">Broadcast Address:</span>
              <span className="text-rose-300">{info.broadcastIp}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Binary Bitmask:</span>
              <span className="text-purple-300">{info.ipBinary}</span>
            </div>
          </div>

          {/* Cloud Reservation Notice */}
          <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-4 text-xs text-slate-300 flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-300">Hyperscaler Cloud 5-IP Reservation Rule:</strong>
              <p className="mt-1 text-slate-400">
                AWS, Azure, and Google Cloud automatically reserve the first 4 IP addresses and the last IP address of every subnet:
                (1) Network Address, (2) VPC Router Gateway, (3) Internal Cloud DNS, (4) Future reserved, and (5) Subnet Broadcast.
                Hence, a <span className="font-mono text-slate-200">/24</span> subnet yields 251 usable host IPs rather than 256.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
