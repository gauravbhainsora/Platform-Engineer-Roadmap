'use client';

import { Info, Network } from 'lucide-react';
import { useState } from 'react';

export function CidrCalculator() {
  const [ipInput, setIpInput] = useState('10.0.0.0');
  const [prefix, setPrefix] = useState<number>(16);

  // Helper calculation functions
  const calculateCidr = () => {
    try {
      const octets = ipInput.trim().split('.');
      if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32 || octets.some((part) => !/^\d{1,3}$/.test(part))) return null;
      const parts = octets.map(Number);
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
    } catch {
      return null;
    }
  };

  const info = calculateCidr();

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-3 border-b border-line pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-soft text-sky-ink border border-sky-line">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Visual Cloud CIDR & Subnet Calculator</h2>
          <p className="text-xs text-body">
            Compute network bounds, host capacity, and hyperscaler 5-IP reserved allocations
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-xs font-medium text-body mb-2">
            Base IP Address
          </label>
          <input aria-label="Base IP address"
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="10.0.0.0"
            className="w-full rounded-xl border border-line bg-inset px-4 py-2.5 font-mono text-sm text-ink placeholder-muted focus:border-sky-line focus-visible:outline-2 focus-visible:outline-focus"
          />
          <div className="mt-2 flex gap-2">
            {['10.0.0.0', '172.16.0.0', '192.168.1.0'].map((preset) => (
              <button
                key={preset}
                onClick={() => setIpInput(preset)}
                className="rounded-lg bg-subtle px-2.5 py-1 text-xs font-mono text-body hover:text-ink hover:bg-selected transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-body">
              Subnet Mask Prefix (/{prefix})
            </label>
            <span className="font-mono text-xs text-sky-ink font-semibold">
              {info ? info.totalIps.toLocaleString() : 0} Total IPs
            </span>
          </div>
          <input
            type="range"
            aria-label="CIDR prefix length"
            min={8}
            max={30}
            value={prefix}
            onChange={(e) => setPrefix(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
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
            <div className="rounded-xl border border-line bg-inset p-4">
              <span className="text-xs font-medium text-muted">Calculated CIDR</span>
              <p className="text-base font-mono font-bold text-sky-ink mt-1">{info.cidr}</p>
            </div>
            <div className="rounded-xl border border-line bg-inset p-4">
              <span className="text-xs font-medium text-muted">Subnet Netmask</span>
              <p className="text-base font-mono font-bold text-ink mt-1">{info.netmask}</p>
            </div>
            <div className="rounded-xl border border-line bg-inset p-4">
              <span className="text-xs font-medium text-muted">Total Addresses</span>
              <p className="text-base font-mono font-bold text-emerald-ink mt-1">
                {info.totalIps.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-inset p-4">
              <span className="text-xs font-medium text-muted">Cloud Usable IPs</span>
              <p className="text-base font-mono font-bold text-sky-ink mt-1">
                {info.cloudUsable.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-inset p-5 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">Network Address:</span>
              <span className="text-ink">{info.networkIp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">First Usable Host:</span>
              <span className="text-emerald-ink">{info.firstUsable}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">Last Usable Host:</span>
              <span className="text-emerald-ink">{info.lastUsable}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">Broadcast Address:</span>
              <span className="text-rose-ink">{info.broadcastIp}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Binary Bitmask:</span>
              <span className="text-purple-ink">{info.ipBinary}</span>
            </div>
          </div>

          {/* Cloud Reservation Notice */}
          <div className="rounded-xl border border-sky-line bg-sky-tint p-4 text-xs text-body flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-ink shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-ink">Hyperscaler Cloud 5-IP Reservation Rule:</strong>
              <p className="mt-1 text-muted">
                AWS, Azure, and Google Cloud automatically reserve the first 4 IP addresses and the last IP address of every subnet:
                (1) Network Address, (2) VPC Router Gateway, (3) Internal Cloud DNS, (4) Future reserved, and (5) Subnet Broadcast.
                Hence, a <span className="font-mono text-ink">/24</span> subnet yields 251 usable host IPs rather than 256.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
