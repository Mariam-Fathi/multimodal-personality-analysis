"""
LSTNet architectures for video (35-d), voice (34-d), and text (768-d) streams.
Match Fusion2.ipynb exactly for loading saved state dicts.
"""
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


def _make_skip_reccs(conv_out_channels, skip_steps, skip_reccs_out_channels):
    skip_reccs = nn.ModuleDict()
    for i in range(len(skip_steps)):
        skip_reccs[str(i)] = nn.GRU(
            conv_out_channels, skip_reccs_out_channels[i], batch_first=True
        )
    return skip_reccs


class LSTNet_video(nn.Module):
    def __init__(self):
        super().__init__()
        self.num_features = 35
        self.conv1_out_channels = 100
        self.conv1_kernel_height = 7
        self.recc1_out_channels = 100
        self.skip_steps = [30]
        self.skip_reccs_out_channels = [5]
        self.output_out_features = 5
        self.ar_window_size = 7
        self.dropout = nn.Dropout(p=0.2)

        self.conv1 = nn.Conv2d(
            1, self.conv1_out_channels,
            kernel_size=(self.conv1_kernel_height, self.num_features)
        )
        self.recc1 = nn.GRU(
            self.conv1_out_channels, self.recc1_out_channels, batch_first=True
        )
        self.skip_reccs = _make_skip_reccs(
            self.conv1_out_channels, self.skip_steps, self.skip_reccs_out_channels
        )
        self.output_in_features = self.recc1_out_channels + int(
            np.dot(self.skip_steps, self.skip_reccs_out_channels)
        )
        self.output = nn.Linear(self.output_in_features, self.output_out_features)
        self.ar = nn.Linear(self.ar_window_size, 1)

    def forward(self, X):
        batch_size = X.size(0)
        C = X.unsqueeze(1)
        C = F.relu(self.conv1(C))
        C = self.dropout(C)
        C = torch.squeeze(C, 3)
        R = C.permute(0, 2, 1)
        out, _ = self.recc1(R)
        R = out[:, -1, :]
        R = self.dropout(R)
        shrinked_time_steps = C.size(2)
        for i in range(len(self.skip_steps)):
            skip_step = self.skip_steps[i]
            skip_sequence_len = shrinked_time_steps // skip_step
            S = C[:, :, -skip_sequence_len * skip_step:]
            S = S.view(S.size(0), S.size(1), skip_sequence_len, skip_step)
            S = S.permute(0, 3, 2, 1).contiguous()
            S = S.view(S.size(0) * S.size(1), S.size(2), S.size(3))
            out, _ = self.skip_reccs[str(i)](S)
            S = out[:, -1, :]
            S = S.view(batch_size, skip_step * S.size(1))
            S = self.dropout(S)
            R = torch.cat((R, S), 1)
        O = F.relu(self.output(R))
        AR = X[:, -self.ar_window_size:, 3:4]
        AR = AR.permute(0, 2, 1).contiguous()
        AR = self.ar(AR)
        AR = AR.squeeze(2)
        O = O + AR
        return O


class LSTNet_voice(nn.Module):
    def __init__(self):
        super().__init__()
        self.num_features = 34
        self.conv1_out_channels = 100
        self.conv1_kernel_height = 7
        self.recc1_out_channels = 100
        self.skip_steps = [30]
        self.skip_reccs_out_channels = [5]
        self.output_out_features = 5
        self.ar_window_size = 7
        self.dropout = nn.Dropout(p=0.2)

        self.conv1 = nn.Conv2d(
            1, self.conv1_out_channels,
            kernel_size=(self.conv1_kernel_height, self.num_features)
        )
        self.recc1 = nn.GRU(
            self.conv1_out_channels, self.recc1_out_channels, batch_first=True
        )
        self.skip_reccs = _make_skip_reccs(
            self.conv1_out_channels, self.skip_steps, self.skip_reccs_out_channels
        )
        self.output_in_features = self.recc1_out_channels + int(
            np.dot(self.skip_steps, self.skip_reccs_out_channels)
        )
        self.output = nn.Linear(self.output_in_features, self.output_out_features)
        self.ar = nn.Linear(self.ar_window_size, 1)

    def forward(self, X):
        batch_size = X.size(0)
        C = X.unsqueeze(1)
        C = F.relu(self.conv1(C))
        C = self.dropout(C)
        C = torch.squeeze(C, 3)
        R = C.permute(0, 2, 1)
        out, _ = self.recc1(R)
        R = out[:, -1, :]
        R = self.dropout(R)
        shrinked_time_steps = C.size(2)
        for i in range(len(self.skip_steps)):
            skip_step = self.skip_steps[i]
            skip_sequence_len = shrinked_time_steps // skip_step
            S = C[:, :, -skip_sequence_len * skip_step:]
            S = S.view(S.size(0), S.size(1), skip_sequence_len, skip_step)
            S = S.permute(0, 3, 2, 1).contiguous()
            S = S.view(S.size(0) * S.size(1), S.size(2), S.size(3))
            out, _ = self.skip_reccs[str(i)](S)
            S = out[:, -1, :]
            S = S.view(batch_size, skip_step * S.size(1))
            S = self.dropout(S)
            R = torch.cat((R, S), 1)
        O = F.relu(self.output(R))
        AR = X[:, -self.ar_window_size:, 3:4]
        AR = AR.permute(0, 2, 1).contiguous()
        AR = self.ar(AR)
        AR = AR.squeeze(2)
        O = O + AR
        return O


class LSTNet_text(nn.Module):
    def __init__(self):
        super().__init__()
        self.num_features = 768
        self.conv1_out_channels = 100
        self.conv1_kernel_height = 7
        self.recc1_out_channels = 100
        self.skip_steps = [30]
        self.skip_reccs_out_channels = [5]
        self.output_out_features = 5
        self.ar_window_size = 7
        self.dropout = nn.Dropout(p=0.2)

        self.conv1 = nn.Conv2d(
            1, self.conv1_out_channels,
            kernel_size=(self.conv1_kernel_height, self.num_features)
        )
        self.recc1 = nn.GRU(
            self.conv1_out_channels, self.recc1_out_channels, batch_first=True
        )
        self.skip_reccs = _make_skip_reccs(
            self.conv1_out_channels, self.skip_steps, self.skip_reccs_out_channels
        )
        self.output_in_features = self.recc1_out_channels + int(
            np.dot(self.skip_steps, self.skip_reccs_out_channels)
        )
        self.output = nn.Linear(self.output_in_features, self.output_out_features)
        self.ar = nn.Linear(self.ar_window_size, 1)

    def forward(self, X):
        batch_size = X.size(0)
        C = X.unsqueeze(1)
        C = F.relu(self.conv1(C))
        C = self.dropout(C)
        C = torch.squeeze(C, 3)
        R = C.permute(0, 2, 1)
        out, _ = self.recc1(R)
        R = out[:, -1, :]
        R = self.dropout(R)
        shrinked_time_steps = C.size(2)
        for i in range(len(self.skip_steps)):
            skip_step = self.skip_steps[i]
            skip_sequence_len = shrinked_time_steps // skip_step
            S = C[:, :, -skip_sequence_len * skip_step:]
            S = S.view(S.size(0), S.size(1), skip_sequence_len, skip_step)
            S = S.permute(0, 3, 2, 1).contiguous()
            S = S.view(S.size(0) * S.size(1), S.size(2), S.size(3))
            out, _ = self.skip_reccs[str(i)](S)
            S = out[:, -1, :]
            S = S.view(batch_size, skip_step * S.size(1))
            S = self.dropout(S)
            R = torch.cat((R, S), 1)
        O = F.relu(self.output(R))
        AR = X[:, -self.ar_window_size:, 3:4]
        AR = AR.permute(0, 2, 1).contiguous()
        AR = self.ar(AR)
        AR = AR.squeeze(2)
        O = O + AR
        return O
